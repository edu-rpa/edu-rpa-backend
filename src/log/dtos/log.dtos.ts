import { ApiProperty } from '@nestjs/swagger';

export class LogGroupDetail {
  @ApiProperty({ description: 'Name of the log group' })
  logGroupName: string;

  @ApiProperty({
    description: 'Creation time of the log group',
    type: 'string',
    format: 'date-time',
  })
  creationTime: Date;
}

export class LogGroupResponse {
  @ApiProperty({ type: [LogGroupDetail], description: 'List of log groups' })
  data: LogGroupDetail[];
}

export class LogStreamDetail {
  @ApiProperty({ description: 'Name of the log stream' })
  logStreamName: string;

  @ApiProperty({
    description: 'Creation time of the log stream',
    type: 'string',
    format: 'date-time',
  })
  creationTime: Date;

  @ApiProperty({
    description: 'Time of the last event in the log stream',
    type: 'string',
    format: 'date-time',
  })
  lastEventTime: Date;
}

export class LogStreamResponse {
  @ApiProperty({ type: [LogStreamDetail], description: 'List of log streams' })
  data: LogStreamDetail[];
}

export class LogEvent {
  @ApiProperty({ description: 'Timestamp of the log event', type: 'string', format: 'date-time' })
  timestamp: Date;

  @ApiProperty({ description: 'Message of the log event' })
  message: string;
}
