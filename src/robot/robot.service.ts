import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Robot } from './entity/robot.entity';
import { CreateRobotDto } from './dto/create-robot.dto';
import { Process } from 'src/processes/entity/process.entity';
import { ProcessNotFoundException, RobotNotFoundException } from 'src/common/exceptions';
import { 
  S3Client,
  PutObjectCommand, 
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RobotService {
  private readonly s3Client: S3Client;

  constructor(
    @InjectRepository(Robot)
    private robotRepository: Repository<Robot>,
    @InjectRepository(Process)
    private processRepository: Repository<Process>,
    private configService: ConfigService,
  ) {
    this.s3Client = new S3Client({ region: configService.get('AWS_REGION_EXTRA') });
  }
  
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

    const bucket = this.configService.get('AWS_S3_ROBOT_BUCKET_NAME');
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: `${userId}/${process.id}/${process.version}/robot-code.json`,
      Body: createRobotDto.code,
      ContentType: 'application/json',
    });
    await this.s3Client.send(command);

    return this.robotRepository.save({
      ...createRobotDto,
      userId,
      processVersion: process.version,
    });
  }
}
