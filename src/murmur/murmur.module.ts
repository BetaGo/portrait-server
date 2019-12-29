import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Murmur } from './murmur.entity';
import { MurmurResolver } from './murmur.resolver';
import { MurmurService } from './murmur.service';

@Module({
  imports: [TypeOrmModule.forFeature([Murmur])],
  providers: [MurmurService, MurmurResolver],
  exports: [MurmurService],
})
export class MurmurModule {}
