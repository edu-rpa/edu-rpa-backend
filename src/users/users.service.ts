import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';

export type UserCreate = Pick<User, 'name' | 'email' | 'hashedPassword'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string, options?: {
    exclude: Array<keyof User>
  }): Promise<User | null> {
    const user = await this.usersRepository.findOneBy({ email });
    if (!user) {
      return null;
    }
    if (options?.exclude) {
      options.exclude.forEach((key) => {
        delete user[key];
      });
    }
    return user;
  }

  async create(user: UserCreate): Promise<User> {
    return this.usersRepository.save(user);
  }
}
