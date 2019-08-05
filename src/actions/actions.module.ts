import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from './actions.entity';
import { ActionsService } from './actions.service';
import { ActionsResolver } from './actions.resolver';
import { CommonModule } from '../common/common.module';

@Module({
  imports: [TypeOrmModule.forFeature([Action]), CommonModule],
  providers: [ActionsService, ActionsResolver],
})
export class ActionsModule {}
