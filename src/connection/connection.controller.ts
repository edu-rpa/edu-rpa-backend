import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { UserDecor } from 'src/common/decorators/user.decorator';
import { UserPayload } from 'src/auth/strategy/jwt.strategy';
import { AuthorizationProvider } from 'src/connection/entity/connection.entity';
import {
  ApiTags,
  ApiBearerAuth,
  ApiQuery,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/common/decorators/public.decorator';
import { GetUserCredentialBodyDto } from './dto/robot-credentials-body.dto';
import { GetUserCredentialWithRobotVersionBodyDto } from './dto/robot-version-credentials-body.dto';

@Controller('connection')
@ApiTags('connection')
@ApiBearerAuth()
export class ConnectionController {
  constructor(private readonly connectionService: ConnectionService) {}

  @Get()
  @ApiQuery({ name: 'provider', enum: AuthorizationProvider, required: false })
  async getConnections(
    @UserDecor() user: UserPayload,
    @Query('provider') provider?: AuthorizationProvider,
  ) {
    return this.connectionService.getConnections(user.id, provider);
  }

  @Get('/refresh')
  async refreshToken(
    @UserDecor() user: UserPayload,
    @Query('provider') provider: AuthorizationProvider,
    @Query('name') name: string,
  ) {
    return this.connectionService.refreshToken(user.id, provider, name);
  }

  @Delete()
  async removeConnection(
    @UserDecor() user: UserPayload,
    @Query('provider') provider: AuthorizationProvider,
    @Query('name') name: string,
  ) {
    return this.connectionService.removeConnection(user.id, provider, name);
  }

  @Post('/robot')
  async getConnectionsForRobotRun(
    @UserDecor() user: UserPayload,
    @Body() body: Omit<GetUserCredentialWithRobotVersionBodyDto, 'userId'>,
  ) {
    const { id } = user;
    const { processId, processVersion } = body;
    try {
      let result = await this.connectionService.getRobotConnectionsForUser(
        id,
        processId,
        processVersion,
      );
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

  @Get('/robot/:robotKey')
  async getConnectionListByRobotKey(
    @Param('robotKey') robotKey: string,
    @Query('limit') limit?: number | undefined,
    @Query('offset') offset?: number | undefined,
  ) {
    try {
      limit = isNaN(limit as number) ? undefined : limit;
      offset = isNaN(offset as number) ? undefined : offset;
      let result = await this.connectionService.getAllConnectionsByRobotKey(
        robotKey,
        limit,
        offset,
      );
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

  @Get('/usage/:connectionKey')
  async getRobotListUsedConnection(
    @UserDecor() user: UserPayload,
    @Param('connectionKey') connectionKey: string,
    @Query('limit') limit?: number | undefined,
    @Query('offset') offset?: number | undefined,
  ) {
    try {
      limit = isNaN(limit as number) ? undefined : limit;
      offset = isNaN(offset as number) ? undefined : offset;
      let result = await this.connectionService.getRobotsByConnection(connectionKey, limit, offset);
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

  @Post('/connectionKey')
  async getConnectionByConnectionKey(
    @Body() body: {
      connectionKeys: string[]
    }
  ) {
    try {
      let result = await this.connectionService.getConnectionByConnectionKey(body.connectionKeys);
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


  @Post('/for-robot/version')
  @Public()
  @UseGuards(AuthGuard('api-key'))
  async getConnectionsForRobotVersion(@Body() body: GetUserCredentialWithRobotVersionBodyDto) {
    const { userId, processId, processVersion } = body;
    return this.connectionService.getRobotConnection(userId, processId, processVersion);
  }
}
