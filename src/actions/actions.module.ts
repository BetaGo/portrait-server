import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Action } from './actions.entity';
import { ActionsService } from './actions.service';
import { ActionsResolver } from './actions.resolver';
import { CommonModule } from '../common/common.module';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [TypeOrmModule.forFeature([Action]), CommonModule, TagsModule],
  providers: [ActionsService, ActionsResolver],
})
export class ActionsModule {}
