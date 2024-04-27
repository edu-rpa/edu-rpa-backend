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
      const result = await this.robotRunDetailRepository
        .createQueryBuilder('r')
        .select([
          'r.kw_id',
          'r.kw_name',
          'r.kw_args',
          'r.kw_status',
          'r.messages',
          'r.start_time',
          'r.end_time',
          'TIMESTAMPDIFF(SECOND, r.start_time, r.end_time) AS elapsed_time',
        ])
        .where('r.uuid = :uuid', { uuid })
        .andWhere('r.user_id = :userId', { userId })
        .andWhere('r.process_id = :processId', { processId })
        .andWhere('r.version = :version', { version })
        .orderBy('r.kw_id')
        .getMany();
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
