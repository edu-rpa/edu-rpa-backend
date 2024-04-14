import { Body, Controller, Delete, Get, HttpException, HttpStatus, Post, Query, UseGuards } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { UserDecor } from 'src/common/decorators/user.decorator';
import { UserPayload } from 'src/auth/strategy/jwt.strategy';
import { AuthorizationProvider } from 'src/connection/entity/connection.entity';
import { ApiTags, ApiBearerAuth, ApiQuery, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Public } from 'src/common/decorators/public.decorator';
import { GetUserCredentialBodyDto } from './dto/robot-credentials-body.dto';
import { GetUserCredentialWithRobotVersionBodyDto } from './dto/robot-version-credentials-body.dto';

@Controller('connection')
@ApiTags('connection')
@ApiBearerAuth()
export class ConnectionController {
  constructor(
    private readonly connectionService: ConnectionService
  ) {}

  @Get()
  @ApiQuery({ name: 'provider', enum: AuthorizationProvider, required: false })
  async getConnections(@UserDecor() user: UserPayload, @Query('provider') provider?: AuthorizationProvider) {
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
  @ApiBody({ type: GetUserCredentialBodyDto }) // Use this for request body
  async getConnectionsForRobotRun(
    @UserDecor() user: UserPayload,
    @Body() body: GetUserCredentialBodyDto
  ){
    const {providers} = body
    try {
      let result = await this.connectionService.getRobotConnectionByProviders(user.id, providers)
      return result
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        error: JSON.stringify(error),
      }, HttpStatus.FORBIDDEN, {
        cause: error
      });
    }
  }


  @Post('/for-robot/version')
  @Public()
  @UseGuards(AuthGuard('api-key'))
  async getConnectionsForRobotVersion(
    @Body() body: GetUserCredentialWithRobotVersionBodyDto
  ){
    const {userId, processId, processVersion} = body
    return this.connectionService.getRobotConnection(userId, processId, processVersion)
  }
}
