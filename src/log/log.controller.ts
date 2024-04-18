import { Controller, Get, Query } from '@nestjs/common';
import { LogService } from './log.service';
import { ApiBearerAuth, ApiQuery, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { LogEvent, LogGroupResponse, LogStreamResponse } from './dtos/log.dtos';

@Controller('logs')
@ApiTags('logs')
@ApiBearerAuth()
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get('/groups')
  @ApiResponse({
    status: 200,
    description: 'Fetch all log groups',
    type: LogGroupResponse,
  })
  async getLogGroups(): Promise<LogGroupResponse> {
    return this.logService.getAllLogGroups();
  }

  @Get('/streams')
  @ApiQuery({ name: 'group', required: true })
  @ApiResponse({
    status: 200,
    description: 'Fetch all streams for a log group',
    type: LogStreamResponse,
  })
  getLogStreams(@Query('group') logGroupName: string): Promise<LogStreamResponse> {
    return this.logService.getAllLogStreams(logGroupName);
  }

  @Get('/streams/detail')
  @ApiQuery({ name: 'group', required: true })
  @ApiQuery({ name: 'stream', required: true })
  @ApiResponse({
    status: 200,
    description: 'Fetch all events from a specific log stream',
    type: [LogEvent],
  })
  getLogStreamDetail(@Query('group') logGroupName: string, @Query('stream') logStreamName: string) {
    return this.logService.getLogStreamDetail(logGroupName, logStreamName);
  }
}
