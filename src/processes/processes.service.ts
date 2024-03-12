import { Injectable } from '@nestjs/common';
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

@Injectable()
export class ProcessesService {
  constructor(
    @InjectRepository(Process)
    private processRepository: Repository<Process>,
    @InjectModel(ProcessDetail.name) 
    private processDetailModel: Model<ProcessDetail>,
    private readonly processesValidateService: ProcessesValidateService,
    private readonly usersService: UsersService,
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
    });
    if (!process) {
      throw new ProcessNotFoundException();
    }
    
    const promises = shareToEmails.map(async (email) => {
      const user = await this.usersService.findOneByEmail(email);
      if (!user) {
        throw new UserNotFoundException();
      }
      await this.createSharedProcess(process, user.id);
    });
    await Promise.all(promises);
  }

  private async createSharedProcess(process: Process, shareTo: number) {
    await this.processRepository.save({
      ...process,
      id: process.id,
      userId: shareTo,
      sharedByUserId: process.userId,
      version: 0,
    });

    const processDetail = await this.processDetailModel.findById(`${process.userId}.${process.id}`);
    await new this.processDetailModel({
      _id: `${shareTo}.${process.id}`,
      xml: processDetail.xml,
      variables: processDetail.variables,
      activities: processDetail.activities,
    }).save();
  }

  async getSharedToOfProcess(userId: number, processId: string) {
    return this.processRepository.createQueryBuilder('process')
      .leftJoinAndSelect('process.user', 'user', 'user.id = process.userId')
      .where('process.id = :processId', { processId })
      .andWhere('process.userId != :userId', { userId })
      .getMany();
  }
}
