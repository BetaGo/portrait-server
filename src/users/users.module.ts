import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersResolver } from './users.resolver';
import { UserWord } from './user-words/user-words.entity';
import { UserWordsService } from './user-words/user-words.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserWord])],
  providers: [UsersService, UsersResolver, UserWordsService],
  exports: [UsersService, UserWordsService],
})
export class UsersModule {}
