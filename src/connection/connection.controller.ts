import { Controller, Get, Query } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { UserDecor } from 'src/common/decorators/user.decorator';
import { UserPayload } from 'src/auth/strategy/jwt.strategy';
import { AuthorizationProvider } from 'src/entities/connection.entity';

@Controller('connection')
export class ConnectionController {
  constructor(
    private readonly connectionService: ConnectionService
  ) {}

  @Get()
  async getConnections(@UserDecor() user: UserPayload, @Query('provider') provider?: AuthorizationProvider) {
    return this.connectionService.getConnections(user.id, provider);
  }
}
