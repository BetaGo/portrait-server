import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { GQLAuthGuard } from '../auth/graphql-auth-guard.service';
import { GeolocationService } from './geolocation.service';
import { CreateGeolocationDto } from './dto/create-geolocation';
import { UserGQL } from '../users/users.decorator';
import { User } from '../users/users.entity';

const pubSub = new PubSub();

@Resolver('geolocation')
export class GeolocationResolver {
  constructor(private readonly geolocationServices: GeolocationService) {}

  @Query('geolocation')
  @UseGuards(GQLAuthGuard)
  getLatestGeolocation() {
    return this.geolocationServices.getLatestGeolocation();
  }

  @Query('getGeolocation')
  @UseGuards(GQLAuthGuard)
  getGeolocation(
    @Args('from')
    from: Date,
    @Args('to')
    to: Date,
  ) {
    return this.geolocationServices.getGeolocationByDateRange(from, to);
  }

  @Mutation('createGeolocation')
  @UseGuards(GQLAuthGuard)
  async createGeolocation(
    @Args('createGeolocationInput')
    args: CreateGeolocationDto,

    @UserGQL()
    user: User,
  ) {
    const geolocation = await this.geolocationServices.createGeolocation({...args, user});
    pubSub.publish('catCreated', { geolocationCreated: geolocation });
    return geolocation;
  }

  @Subscription('geolocationCreated')
  geolocationCreated() {
    return pubSub.asyncIterator('geolocationCreated');
  }
}
