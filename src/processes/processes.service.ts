import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { InjectRepository } from '@nestjs/typeorm';
import { Model } from 'mongoose';
import { Process as ProcessEntity } from 'src/entities/process.entity';
import { Process as ProcessDocument } from 'src/schemas/process.schema';
import { Repository } from 'typeorm';
import { ProcessesValidateService } from './processes-validate.service';

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
}
