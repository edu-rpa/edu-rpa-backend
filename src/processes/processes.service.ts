import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { Process as ProcessEntity } from 'src/entities/process.entity';
import { Process as ProcessDocument, ProcessForValidation } from 'src/schemas/process.schema';
import { Repository } from 'typeorm';
import { ProcessesValidateService } from './processes-validate.service';
import { CreateProcessDto } from './dto/create-process.dto';
import { UnableToCreateProcessException, ProcessNotFoundException } from 'src/common/exceptions';
import { UpdateProcessDto } from './dto/update-process.dto';
import { SaveProcessDto } from './dto/save-process.dto';

@Injectable()
export class ProcessesService {
  constructor(
    @InjectRepository(ProcessEntity)
    private processRepository: Repository<ProcessEntity>,
    @InjectModel(ProcessDocument.name) 
    private processModel: Model<ProcessDocument>,
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
      name: createProcessDto.name,
      description: createProcessDto.description,
      userId,
    });

    const processDocument = new this.processModel({
      _id: processEntity.id,
      xml: createProcessDto.xml,
      variables: {},
      activities: [],
    });

    try {
      await processDocument.save();
    } catch (error) {
      await this.processRepository.delete(processEntity.id);
      throw new UnableToCreateProcessException();
    }
    return processDocument;
  }

  async getProcess(userId: number, processId: number) {
    const process = await this.processRepository.findOne({
      where: { id: processId, userId },
    });
    if (!process) {
      throw new ProcessNotFoundException();
    }
    return this.processModel.findById(processId);
  }

  async updateProcess(userId: number, processId: number, updateProcessDto: UpdateProcessDto) {
    const process = await this.processRepository.findOne({
      where: { id: processId, userId },
    });
    if (!process) {
      throw new ProcessNotFoundException();
    }
    return this.processRepository.update(processId, updateProcessDto);
  }

  async saveProcess(userId: number, processId: number, saveProcessDto: SaveProcessDto) {
    const process = await this.processRepository.findOne({
      where: { id: processId, userId },
    });
    if (!process) {
      throw new ProcessNotFoundException();
    }

    const processDocument = new this.processModel({
      _id: processId,
      ...saveProcessDto,
    });
    const processForValidation = new ProcessForValidation(processDocument);
    await this.processesValidateService.validateProcess(userId, processForValidation);

    await this.processModel.updateOne({ _id: processId }, {
      ...saveProcessDto,
    });
    return this.processRepository.update(processId, {
      updatedAt: new Date(),
      version: process.version + 1,
    });
  }

  async deleteProcess(userId: number, processId: number) {
    const process = await this.processRepository.findOne({
      where: { id: processId, userId },
    });
    if (!process) {
      return null;
    }
    await this.processModel.deleteOne({ _id: processId });
    return this.processRepository.delete(processId);
  }
}
