import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RobotReportService } from './robot-report.service';
import { UserDecor } from 'src/common/decorators/user.decorator';
import { UserPayload } from 'src/auth/strategy/jwt.strategy';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('robot-report')
@ApiTags('robot-report')
@ApiBearerAuth()
export class RobotReportController {
  constructor(private readonly robotRunDetailService: RobotReportService) {}

  @Get('/run-detail/:streamID/:processID/:version')
  async fetchRobotRunDetails(
    @UserDecor() user: UserPayload,
    @Param('streamID') streamID: string,
    @Param('processID') processID: string,
    @Param('version') version: number,
  ) {
    return this.robotRunDetailService.getRobotRunDetails(
      streamID,
      user.id,
      processID,
      version,
    );
  }
}
