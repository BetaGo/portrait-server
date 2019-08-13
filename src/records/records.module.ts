import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Record } from './records.entity';
import { RecordsService } from './records.service';
import { ActionsResolver } from './records.resolver';
import { CommonModule } from '../common/common.module';
import { TagsModule } from '../tags/tags.module';

@Module({
  imports: [TypeOrmModule.forFeature([Record]), CommonModule, TagsModule],
  providers: [RecordsService, ActionsResolver],
})
export class RecordsModule {}
