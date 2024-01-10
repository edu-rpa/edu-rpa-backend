import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UnableToCreateConnectionException } from 'src/common/exceptions';
import { Connection, AuthorizationProvider } from 'src/connection/entity/connection.entity';
import { Repository } from 'typeorm';

export interface UserTokenFromProvider {
  accessToken: string;
  refreshToken: string;
  profile: any;
}

export interface CreateConnectionDto {
  provider: AuthorizationProvider;
  fromUser: number;
  accessToken: string;
  refreshToken: string;
  email?: string;
}

@Injectable()
export class ConnectionService {
  constructor(
    @InjectRepository(Connection)
    private connectionRepository: Repository<Connection>,
  ) {}

  async createConnection(createConnectionDto: CreateConnectionDto) {
    await this.checkIfAbleToCreateConnection(createConnectionDto);
    const connection = await this.connectionRepository.save({
      provider: createConnectionDto.provider,
      userId: createConnectionDto.fromUser,
      name: createConnectionDto.email? createConnectionDto.email : Date.now().toString(),
      accessToken: createConnectionDto.accessToken,
      refreshToken: createConnectionDto.refreshToken,
    });
    return connection;
  }

  async getConnections(userId: number, provider?: AuthorizationProvider) {
    let whereString = 'connection.userId = :userId';
    if (provider) {
      whereString += ' AND connection.provider = :provider';
    }
    return this.connectionRepository.createQueryBuilder('connection')
      .select(['connection.provider', 'connection.name'])
      .where(whereString, { userId, provider })
      .getMany();
  }

  async getConnection(userId: number, query: {
    provider: AuthorizationProvider;
    name: string;
  }) {
    const connection = await this.connectionRepository.findOneBy({
      userId,
      provider: AuthorizationProvider[query.provider],
      name: query.name,
    });
    return connection;
  }

  private async checkIfAbleToCreateConnection(createConnectionDto: CreateConnectionDto) {
    if (!createConnectionDto.email) return;
    
    const existingConnection = await this.connectionRepository.findOneBy({
      provider: createConnectionDto.provider,
      userId: createConnectionDto.fromUser,
      name: createConnectionDto.email,
    });
    
    if (existingConnection) {
      throw new UnableToCreateConnectionException();
    }
  }
}
