import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthenticationProvider, User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { EmailAlreadyExistsException } from 'src/common/exceptions';

export type UserCreate = Pick<User, 'name' | 'email' | 'hashedPassword'>;
export type UserFromProvider = Pick<User, 'name' | 'email' | 'avatarUrl' | 'provider' | 'providerId'>;
export interface UserFromGoogle {
  id: string;
  displayName: string;
  emails: Array<{
    value: string;
  }>;
  photos: Array<{
    value: string;
  }>;
}

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

  async create(user: UserCreate | UserFromProvider): Promise<User> {
    return this.usersRepository.save(user);
  }

  async findOrCreateGoogleUser({
    id,
    displayName,
    emails,
    photos,
  }: UserFromGoogle): Promise<User> {
    const email = emails[0].value;
    const avatarUrl = photos[0].value;

    let user = await this.findOneByEmail(email);
    if (!user) {
      user = await this.create({
        name: displayName,
        email,
        avatarUrl,
        provider: AuthenticationProvider.GOOGLE,
        providerId: id,
      });
    } else if (user.provider !== AuthenticationProvider.GOOGLE) {
      throw new EmailAlreadyExistsException();
    }
    return user;
  }
}
