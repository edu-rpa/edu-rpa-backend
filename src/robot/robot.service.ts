import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Robot } from './entity/robot.entity';
import { CreateRobotDto } from './dto/create-robot.dto';
import { Process } from 'src/processes/entity/process.entity';
import { ProcessNotFoundException, RobotNotFoundException } from 'src/common/exceptions';

@Injectable()
export class RobotService {
  constructor(
    @InjectRepository(Robot)
    private robotRepository: Repository<Robot>,
    @InjectRepository(Process)
    private processRepository: Repository<Process>,
  ) {}
  
  async getRobots(userId: number, options?: {
    limit?: number;
    page?: number;
  }) {
    const findOptions = {
      where: { userId },
    };
    if (options?.limit) {
      findOptions['take'] = options.limit;
    }
    if (options?.page) {
      findOptions['skip'] = (options.page - 1) * options.limit;
    }

    return this.robotRepository.find(findOptions);
  }

  async getRobotsCount(userId: number) {
    return this.robotRepository.count({ where: { userId } });
  }

  async createRobot(userId: number, createRobotDto: CreateRobotDto) {
    const process = await this.processRepository.findOne({
      where: { id: createRobotDto.processId, userId },
    });
    if (!process) {
      throw new ProcessNotFoundException();
    }

    return this.robotRepository.save({
      ...createRobotDto,
      userId,
      processVersion: process.version,
    });
  }

  async getRobotDetail(userId: number, robotId: string) {
    const robot = await this.robotRepository.findOne({
      where: { id: robotId, userId },
    });
    if (!robot) {
      throw new RobotNotFoundException();
    }
    return robot;
  }
}