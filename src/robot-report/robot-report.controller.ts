import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RobotReportService } from './robot-report.service';

@Controller('robot-report')
export class RobotReportController {
  constructor(private readonly robotRunDetailService: RobotReportService) {}

  @Post('/log/:streamID')
  async fetchRobotRunDetails(
    @Param('streamID') streamID: string,
    @Body() body: { userID: number; processID: string; version: number },
  ) {
    return this.robotRunDetailService.getRobotRunDetails(
      streamID,
      body.userID,
      body.processID,
      body.version,
    );
  }
}
