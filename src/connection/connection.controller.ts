import { Controller, Delete, Get, Query } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { UserDecor } from 'src/common/decorators/user.decorator';
import { UserPayload } from 'src/auth/strategy/jwt.strategy';
import { AuthorizationProvider } from 'src/connection/entity/connection.entity';
import { ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';

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
}
