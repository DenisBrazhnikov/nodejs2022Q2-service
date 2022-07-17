import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { hash } from 'bcrypt';
import { v4 } from 'uuid';

import { DatabaseInterface } from '../database/interface';
import { CreateUserDto } from './user.create.dto';
import { User } from './user.entity';
import { Database } from '../database/database';

@Injectable()
export class UsersService implements DatabaseInterface<User> {
  constructor(
    private config: ConfigService,
    private database: Database<User>,
  ) {}

  async create(dto: CreateUserDto) {
    const user = new User();

    user.id = v4();
    user.login = dto.login;
    user.password = await hash(
      dto.password,
      Number(this.config.get('CRYPT_SALT')),
    );
    user.createdAt = Date.now();
    user.updatedAt = user.createdAt;
    user.version = 1;

    this.database.create(user);

    return user;
  }

  all() {
    return this.database.all();
  }

  find(id: string) {
    return this.database.find(id);
  }

  async update(id: string, { password, version }) {
    const newUserData: Partial<User> = {
      password: await hash(password, Number(this.config.get('CRYPT_SALT'))),
      updatedAt: Date.now(),
      version,
    };

    return this.database.update(id, newUserData);
  }

  delete(id: string) {
    return this.database.delete(id);
  }
}
