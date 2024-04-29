import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { Process } from 'src/processes/entity/process.entity';
import { ProcessDetail, ProcessForValidation } from 'src/processes/schema/process.schema';
import { Repository } from 'typeorm';
import { ProcessesValidateService } from './processes-validate.service';
import { CreateProcessDto } from './dto/create-process.dto';
import { UnableToCreateProcessException, ProcessNotFoundException, UserNotFoundException } from 'src/common/exceptions';
import { UpdateProcessDto } from './dto/update-process.dto';
import { SaveProcessDto } from './dto/save-process.dto';
import { UsersService } from 'src/users/users.service';
import { NotificationService } from 'src/notification/notification.service';
import { NotificationType } from 'src/notification/entity/notification.entity';

@Injectable()
export class ProcessesService {
  constructor(
    @InjectRepository(Process)
    private processRepository: Repository<Process>,
    @InjectModel(ProcessDetail.name) 
    private processDetailModel: Model<ProcessDetail>,
    private readonly processesValidateService: ProcessesValidateService,
    private readonly usersService: UsersService,
    private readonly notificationService: NotificationService,
  ) {}

  async getProcessesCount(userId: number) {
    return this.processRepository.count({ where: { userId } });
  }

  async getProcesses(userId: number, options?: {
    limit?: number;
    page?: number;
  }) {
    const { limit, page } = options;
    return this.processRepository.createQueryBuilder('process')
      .leftJoinAndSelect('process.sharedByUser', 'user', 'user.id = process.sharedByUserId')
      .where('process.userId = :userId', { userId })
      .orderBy('process.updatedAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();
  }

  async createProcess(userId: number, createProcessDto: CreateProcessDto) {
    const processEntity = await this.processRepository.save({
      ...createProcessDto,
      userId,
    });

    const processDetail = new this.processDetailModel({
      _id: `${userId}.${processEntity.id}`,
      xml: createProcessDto.xml,
      variables: {},
      activities: [],
    });

    try {
      await processDetail.save();
    } catch (error) {
      await this.processRepository.delete(processEntity.id);
      throw new UnableToCreateProcessException();
    }
    return processDetail;
  }

  async getProcess(userId: number, processId: string) {
    const process = await this.processRepository.findOne({
      where: { id: processId, userId },
    });
    if (!process) {
      throw new ProcessNotFoundException();
    }
    return this.processDetailModel.findById(`${userId}.${processId}`);
  }

  async updateProcess(userId: number, processId: string, updateProcessDto: UpdateProcessDto) {
    const process = await this.processRepository.findOne({
      where: { id: processId, userId },
    });
    if (!process) {
      throw new ProcessNotFoundException();
    }
    return this.processRepository.update(processId, updateProcessDto);
  }

  async saveProcess(userId: number, processId: string, saveProcessDto: SaveProcessDto) {
    const process = await this.processRepository.findOne({
      where: { id: processId, userId },
    });
    if (!process) {
      throw new ProcessNotFoundException();
    }

    // NOTE: disable validation temporarily
    // const processDetail = new this.processDetailModel({
    //   _id: processId,
    //   ...saveProcessDto,
    // });
    // const processForValidation = new ProcessForValidation(processDetail);
    // await this.processesValidateService.validateProcess(userId, processForValidation);

    await this.processDetailModel.updateOne({ _id: `${userId}.${processId}` }, {
      ...saveProcessDto,
    });
    return this.processRepository.update({
      id: processId,
      userId,
    }, {
      updatedAt: new Date(),
      version: process.version + 1,
    });
  }

  async deleteProcess(userId: number, processId: string) {
    const process = await this.processRepository.findOne({
      where: { id: processId, userId },
    });
    if (!process) {
      return null;
    }
    await this.processDetailModel.deleteOne({ _id: `${userId}.${processId}` });
    return this.processRepository.delete({ id: processId, userId });
  }

  async shareProcess(userId: number, processId: string, shareToEmails: string[]) {
    const process = await this.processRepository.findOne({
      where: { id: processId, userId },
      relations: ['user'],
    });
    if (!process) {
      throw new ProcessNotFoundException();
    }
    if (process.sharedByUserId) {
      throw new ForbiddenException();
    }
    
    const promises = shareToEmails.map(async (email) => {
      const user = await this.usersService.findOneByEmail(email);
      if (!user) {
        throw new UserNotFoundException();
      }
      await this.createSharedProcess(process, user.id);
      await this.notificationService.createNotification({
        title: `Process has been shared with you`,
        content: `Process ${process.name} has been shared with you by ${process.user.email}`,
        type: NotificationType.PROCESS_SHARED,
        userId: user.id,
      });
    });
    await Promise.all(promises);
  }

  private async createSharedProcess(process: Process, shareTo: number) {
    await this.processRepository.save({
      id: process.id,
      userId: shareTo,
      sharedByUserId: process.userId,
      version: 0,
      name: process.name,
      description: process.description,
    });

    const processDetail = await this.processDetailModel.findById(`${process.userId}.${process.id}`);
    const newSharedProcessDetail = await new this.processDetailModel({
      _id: `${shareTo}.${process.id}`,
      xml: processDetail.xml,
      variables: processDetail.variables,
      activities: processDetail.activities,
    });

    this.processBeforeShare(newSharedProcessDetail);

    await newSharedProcessDetail.save();
  }

  processBeforeShare(processDetail: ProcessDetail) {
    // remove the connection
    processDetail.activities.forEach((activity) => {
      for (const argumentName in activity.properties.arguments) {
        if (argumentName === 'Connection') {
          activity.properties.arguments[argumentName].value = '';
        }
      }
    });
  }

  async getSharedToOfProcess(userId: number, processId: string) {
    const process = await this.processRepository.findOne({
      where: { id: processId, userId },
    });
    if (!process) {
      throw new ProcessNotFoundException();
    }
    if (process.sharedByUserId) {
      throw new ForbiddenException();
    }

    return this.processRepository.createQueryBuilder('process')
      .leftJoinAndSelect('process.user', 'user', 'user.id = process.userId')
      .where('process.id = :processId', { processId })
      .andWhere('process.userId != :userId', { userId })
      .getMany();
  }
}
