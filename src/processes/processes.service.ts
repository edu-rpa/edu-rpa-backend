import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { Process } from 'src/processes/entity/process.entity';
import { ProcessDetail, ProcessForValidation } from 'src/processes/schema/process.schema';
import { Repository } from 'typeorm';
import { ProcessesValidateService } from './processes-validate.service';
import { CreateProcessDto } from './dto/create-process.dto';
import { UnableToCreateProcessException, ProcessNotFoundException } from 'src/common/exceptions';
import { UpdateProcessDto } from './dto/update-process.dto';
import { SaveProcessDto } from './dto/save-process.dto';

@Injectable()
export class ProcessesService {
  constructor(
    @InjectRepository(Process)
    private processRepository: Repository<Process>,
    @InjectModel(ProcessDetail.name) 
    private processDetailModel: Model<ProcessDetail>,
    private readonly processesValidateService: ProcessesValidateService,
  ) {}

  async getProcessesCount(userId: number) {
    return this.processRepository.count({ where: { userId } });
  }

  async getProcesses(userId: number, options?: {
    limit?: number;
    page?: number;
  }) {
    const { limit, page } = options;
    return this.processRepository.find({
      where: { userId },
      take: limit,
      skip: (page - 1) * limit,
    });
  }

  async createProcess(userId: number, createProcessDto: CreateProcessDto) {
    const processEntity = await this.processRepository.save({
      ...createProcessDto,
      userId,
    });

    const processDetail = new this.processDetailModel({
      _id: processEntity.id,
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
    return this.processDetailModel.findById(processId);
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

    const processDetail = new this.processDetailModel({
      _id: processId,
      ...saveProcessDto,
    });
    const processForValidation = new ProcessForValidation(processDetail);
    await this.processesValidateService.validateProcess(userId, processForValidation);

    await this.processDetailModel.updateOne({ _id: processId }, {
      ...saveProcessDto,
    });
    return this.processRepository.update(processId, {
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
    await this.processDetailModel.deleteOne({ _id: processId });
    return this.processRepository.delete(processId);
  }
}
