import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from './actions.entity';
import { ActionsService } from './actions.service';
import { ActionsResolver } from './actions.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Action])],
  providers: [ActionsService, ActionsResolver],
})
export class ActionsModule {}
