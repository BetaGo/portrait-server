import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users.entity';
import { UsersResolver } from './users.resolver';
import { UserWord } from './user-words/user-words.entity';
import { UserWordsService } from './user-words/user-words.service';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserWord]), AuthModule],
  providers: [UsersService, UsersResolver, UserWordsService, AuthService],
  exports: [UsersService, UserWordsService],
})
export class UsersModule {}
