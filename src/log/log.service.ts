import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import {
  CloudWatchLogsClient,
  DescribeLogGroupsCommand,
  DescribeLogGroupsCommandInput,
  GetLogEventsCommand,
  DescribeLogStreamsCommand,
  DescribeLogStreamsCommandInput,
  GetLogEventsCommandInput,
} from '@aws-sdk/client-cloudwatch-logs';
import { ConfigService } from '@nestjs/config';
import { LogEvent, LogGroupResponse, LogStreamResponse } from './dtos/log.dtos';

@Injectable()
export class LogService {
  private cloudWatchLogsClient: CloudWatchLogsClient;

  constructor(private configService: ConfigService) {
    this.cloudWatchLogsClient = new CloudWatchLogsClient({
      region: this.configService.get<string>('AWS_REGION_EXTRA'),
    });
  }

  async getAllLogGroups(nextToken?: string): Promise<LogGroupResponse> {
    const params: DescribeLogGroupsCommandInput = {
      limit: 50,
      logGroupNamePrefix: 'robot',
      nextToken: nextToken,
    };

    try {
      const command = new DescribeLogGroupsCommand(params);
      const { logGroups, nextToken: newToken } = await this.cloudWatchLogsClient.send(command);

      const logGroupDetails = logGroups.map((logGroup) => ({
        logGroupName: logGroup.logGroupName,
        creationTime: new Date(logGroup.creationTime),
      }));

      const response: LogGroupResponse = {
        data: logGroupDetails,
      };

      if (newToken) {
        const moreData = await this.getAllLogGroups(newToken);
        response.data = response.data.concat(moreData.data);
      }
      return response;
    } catch (error) {
      if (error.name === 'ResourceNotFoundException') {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async getAllLogStreams(logGroupName: string, nextToken?: string): Promise<LogStreamResponse> {
    const params: DescribeLogStreamsCommandInput = {
      logGroupName: logGroupName,
      limit: 50,
      nextToken: nextToken,
      orderBy: 'LastEventTime',
      descending: true,
    };

    try {
      const command = new DescribeLogStreamsCommand(params);
      const { logStreams, nextToken: newToken } = await this.cloudWatchLogsClient.send(command);

      const logStreamDetails = logStreams.map((logStream) => ({
        logStreamName: logStream.logStreamName,
        creationTime: new Date(logStream.creationTime),
        lastEventTime: new Date(logStream.lastEventTimestamp),
      }));

      const response: LogStreamResponse = {
        data: logStreamDetails,
      };

      if (newToken) {
        const moreData = await this.getAllLogStreams(logGroupName, newToken);
        response.data = response.data.concat(moreData.data);
      }
      return response;
    } catch (error) {
      if (error.name === 'ResourceNotFoundException') {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async getLogStreamDetail(logGroupName: string, logStreamName: string): Promise<LogEvent[]> {
    const params: GetLogEventsCommandInput = {
      logGroupName: logGroupName,
      logStreamName: logStreamName,
      startFromHead: true,
    };

    try {
      const command = new GetLogEventsCommand(params);
      const { events } = await this.cloudWatchLogsClient.send(command);

      return events.map((event) => ({
        timestamp: new Date(event.timestamp),
        message: event.message,
      }));
    } catch (error) {
      if (error.name === 'ResourceNotFoundException') {
        throw new NotFoundException(error.message);
      }
      throw new InternalServerErrorException(error.message);
    }
  }
}
