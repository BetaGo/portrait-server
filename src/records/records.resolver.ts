import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RecordsService } from './records.service';
import { UseGuards } from '@nestjs/common';
import { GQLAuthGuard } from '../auth/graphql-auth-guard.service';
import { CreateRecordDto } from './dto/create-record';
import { UserGQL } from '../users/users.decorator';
import { User } from '../users/users.entity';
import { TagsService } from '../tags/tags.service';
import { Record } from './records.entity';

@Resolver('Record')
export class RecordsResolver {
  constructor(
    private readonly recordsService: RecordsService,
    private readonly tagsService: TagsService,
  ) {}

  @Mutation('createRecord')
  @UseGuards(GQLAuthGuard)
  async createRecord(
    @Args('createRecordInput') record: CreateRecordDto,
    @UserGQL() user: User,
  ) {
    let newAction = new Record();
    newAction = Object.assign(newAction, record);
    newAction.tags = await this.tagsService.findByIds(record.tagIds);
    newAction.user = user;
    const result = await this.recordsService.create(newAction);
    return this.recordsService.findOneWithRelation(result.id);
  }

  @Query('record')
  @UseGuards(GQLAuthGuard)
  async getRecord(@Args('id') id: number) {
    return this.recordsService.findOneWithRelation(id);
  }

  @Query('getRecords')
  @UseGuards(GQLAuthGuard)
  async findAll() {
    return this.recordsService.findAll();
  }
}
