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

  async getRobotRunDetails(uuid: string, userId: number, processId: string, version: number) {
    const queryBuilder = this.robotRunDetailRepository.createQueryBuilder('robot_run_detail');

    queryBuilder
      .select([
        'robot_run_detail.kw_id',
        'robot_run_detail.kw_name',
        'robot_run_detail.kw_args',
        'robot_run_detail.kw_status',
        'robot_run_detail.messages',
        'robot_run_detail.start_time',
        'robot_run_detail.end_time',
      ])
      .addSelect(
        'TIMESTAMPDIFF(SECOND, robot_run_detail.start_time, robot_run_detail.end_time)',
        'elapsed_time',
      )
      .where('robot_run_detail.uuid = :uuid', { uuid })
      .andWhere('robot_run_detail.user_id = :userId', { userId })
      .andWhere('robot_run_detail.process_id = :processId', { processId })
      .andWhere('robot_run_detail.version = :version', { version })
      .orderBy('robot_run_detail.kw_id', 'ASC');

    const results = await queryBuilder.getRawMany();

    return results;
  }
}
