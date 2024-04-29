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

  async getRobotRunDetailCommands(
    uuid: string,
    userId: number,
    processId: string,
    version: number,
  ) {
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

  async getRobotRunTimeOverall(
    processId: string,
    userId: number,
    version: number,
    passed?: number,
    date?: string,
  ) {
    const queryBuilder = this.robotRunOverallRepository.createQueryBuilder('robot_run_overall');

    queryBuilder
      .select([
        'robot_run_overall.uuid',
        'robot_run_overall.start_time',
        'robot_run_overall.end_time',
        'TIMESTAMPDIFF(SECOND, robot_run_overall.start_time, robot_run_overall.end_time) AS time_execution',
      ])
      .where('robot_run_overall.process_id = :processId', { processId })
      .andWhere('robot_run_overall.user_id = :userId', { userId })
      .andWhere('robot_run_overall.version = :version', { version })
      .andWhere('robot_run_overall.passed = :passed', { passed });

    if (date) {
      queryBuilder.andWhere('DATE(robot_run_overall.start_time) = :date', { date });
    }

    const results = await queryBuilder.getRawMany();

    return results;
  }

  async getAverageExecutionTime(
    processId: string,
    userId: number,
    version: number,
    passed?: number,
    date?: string,
  ) {
    const queryBuilder = this.robotRunOverallRepository.createQueryBuilder('robot_run_overall');

    queryBuilder
      .select(
        'AVG(TIMESTAMPDIFF(SECOND, robot_run_overall.start_time, robot_run_overall.end_time))',
        'avg_time_execution',
      )
      .where('robot_run_overall.process_id = :processId', { processId })
      .andWhere('robot_run_overall.user_id = :userId', { userId })
      .andWhere('robot_run_overall.version = :version', { version })
      .andWhere('robot_run_overall.passed = :passed', { passed });

    if (date) {
      queryBuilder.andWhere('DATE(robot_run_overall.start_time) = :date', { date });
    }

    const result = await queryBuilder.getRawOne();

    return result;
  }

  async getCountsGroupedByPassed(
    processId: string,
    userId: number,
    version: number,
    date?: string,
  ) {
    const queryBuilder = this.robotRunOverallRepository.createQueryBuilder('robot_run_overall');

    queryBuilder
      .select('robot_run_overall.passed', 'passed')
      .addSelect('COUNT(*)', 'count')
      .where('robot_run_overall.process_id = :processId', { processId })
      .andWhere('robot_run_overall.user_id = :userId', { userId })
      .andWhere('robot_run_overall.version = :version', { version });

    if (date) {
      queryBuilder.andWhere('DATE(robot_run_overall.start_time) = :date', { date });
    }

    queryBuilder.groupBy('robot_run_overall.passed');

    const results = await queryBuilder.getRawMany();

    return results;
  }

  async getFailedExecution(processId: string, userId: number, version: number, date?: string) {
    const queryBuilder = this.robotRunOverallRepository.createQueryBuilder('robot_run_overall');

    queryBuilder
      .select('robot_run_overall.uuid', 'uuid')
      .addSelect('robot_run_overall.passed', 'passed')
      .addSelect('robot_run_overall.error_message', 'error_message')
      .addSelect('robot_run_overall.start_time', 'start_time')
      .addSelect('robot_run_overall.end_time', 'end_time')
      .addSelect(
        'TIMESTAMPDIFF(SECOND, robot_run_overall.start_time, robot_run_overall.end_time)',
        'time_execution',
      )
      .where('robot_run_overall.process_id = :processId', { processId })
      .andWhere('robot_run_overall.user_id = :userId', { userId })
      .andWhere('robot_run_overall.version = :version', { version })
      .andWhere('robot_run_overall.passed = :passed', { passed: 0 });

    if (date) {
      queryBuilder.andWhere('DATE(robot_run_overall.start_time) = :date', { date });
    }

    const results = await queryBuilder.getRawMany();

    return results;
  }

  async getCountsGroupedByError(processId: string, userId: number, version: number, date?: string) {
    const queryBuilder = this.robotRunOverallRepository.createQueryBuilder('robot_run_overall');

    queryBuilder
      .select('robot_run_overall.error_message', 'error_message')
      .addSelect('COUNT(*)', 'count')
      .where('robot_run_overall.process_id = :processId', { processId })
      .andWhere('robot_run_overall.user_id = :userId', { userId })
      .andWhere('robot_run_overall.version = :version', { version });

    if (date) {
      queryBuilder.andWhere('DATE(robot_run_overall.start_time) = :date', { date });
    }

    queryBuilder.groupBy('robot_run_overall.error_message');

    const results = await queryBuilder.getRawMany();

    return results;
  }
}
