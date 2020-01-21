import { Module } from '@nestjs/common';
import { En2CnWordsService } from './en2cn-words.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { En2CnWord } from './en2cn-words.entity';

@Module({
  imports: [TypeOrmModule.forFeature([En2CnWord])],
  providers: [En2CnWordsService],
  exports: [En2CnWordsService],
})
export class UsersModule {}
