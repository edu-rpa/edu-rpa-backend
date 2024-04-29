import { Controller, Get, Query } from '@nestjs/common';
import { RobotReportService } from './robot-report.service';
import { UserDecor } from 'src/common/decorators/user.decorator';
import { UserPayload } from 'src/auth/strategy/jwt.strategy';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('robot-report')
@ApiTags('robot-report')
@ApiBearerAuth()
export class RobotReportController {
  constructor(private readonly robotRunDetailService: RobotReportService) {}

  @Get('/detail')
  async fetchRobotRunDetails(
    @UserDecor() user: UserPayload,
    @Query('streamID') streamID: string,
    @Query('processID') processID: string,
    @Query('version') version: number,
  ) {
    return this.robotRunDetailService.getRobotRunDetailCommands(
      streamID,
      user.id,
      processID,
      version,
    );
  }

  @Get('/overall')
  async fetchRobotRunOverall(
    @UserDecor() user: UserPayload,
    @Query('processID') processID: string,
    @Query('version') version: number,
    @Query('date') date?: string,
    @Query('passed') passed?: number,
  ) {
    return this.robotRunDetailService.getRobotRunTimeOverall(
      processID,
      user.id,
      version,
      passed,
      date,
    );
  }

  @Get('/overall/average')
  async fetchRobotRunDetailAverage(
    @UserDecor() user: UserPayload,
    @Query('processID') processID: string,
    @Query('version') version: number,
    @Query('date') date?: string,
    @Query('passed') passed?: number,
  ) {
    return this.robotRunDetailService.getAverageExecutionTime(
      processID,
      user.id,
      version,
      passed,
      date,
    );
  }

  @Get('/overall/group-passed')
  async fetchRobotRunDetailStatisticPassed(
    @UserDecor() user: UserPayload,
    @Query('processID') processID: string,
    @Query('version') version: number,
    @Query('date') date?: string,
  ) {
    return this.robotRunDetailService.getCountsGroupedByPassed(processID, user.id, version, date);
  }

  @Get('/overall/failures')
  async fetchRobotRunDetailFailures(
    @UserDecor() user: UserPayload,
    @Query('processID') processID: string,
    @Query('version') version: number,
    @Query('date') date?: string,
  ) {
    return this.robotRunDetailService.getFailedExecution(processID, user.id, version, date);
  }

  @Get('/overall/group-error')
  async fetchRobotRunDetailStatisticError(
    @UserDecor() user: UserPayload,
    @Query('processID') processID: string,
    @Query('version') version: number,
    @Query('date') date?: string,
  ) {
    return this.robotRunDetailService.getCountsGroupedByError(processID, user.id, version, date);
  }
}
