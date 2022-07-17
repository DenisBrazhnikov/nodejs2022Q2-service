import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Database } from '../database/database';

@Module({
  controllers: [UsersController],
  providers: [UsersService, ConfigService, Database],
  exports: [UsersService],
})
export class UsersModule {}
