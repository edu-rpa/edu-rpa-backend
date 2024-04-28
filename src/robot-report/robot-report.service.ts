import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RobotRunDetail } from './entity/robot-run-detail.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RobotRunLog } from './entity/robot-run-log.entity';
import { RobotRunOverall } from './entity/robot-run-overall.entity';

@Injectable()
export class RobotReportService {
  constructor(
    @InjectRepository(RobotRunDetail)
    private readonly robotRunDetailRepository: Repository<RobotRunDetail>,
    @InjectRepository(RobotRunLog)
    private readonly robotRunLogRepository: Repository<RobotRunLog>,
    @InjectRepository(RobotRunOverall)
    private readonly robotRunOverallRepository: Repository<RobotRunOverall>,
  ) {}

  async getRobotRunDetails(
    uuid: string,
    userId: number,
    processId: string,
    version: number,
  ): Promise<RobotRunDetail[]> {
    try {
      const result = await this.robotRunDetailRepository.find({
        where: {
          uuid,
          userId,
          processId,
          version,
        },
        order: {
          kwId: 'ASC',
        },
      });
      return result;
    } catch (error) {
      console.log(error);
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: JSON.stringify(error),
        },
        HttpStatus.BAD_REQUEST,
        {
          cause: error,
        },
      );
    }
  }
}
