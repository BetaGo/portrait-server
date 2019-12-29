import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';
import { GQLAuthGuard } from '../auth/graphql-auth.guard';
import { GeolocationService } from './geolocation.service';
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
    @Args('latitude')
    latitude: number,

    @Args('longitude')
    longitude: number,

    @Args('altitude')
    altitude: number,

    @Args('time')
    time: Date,

    @UserGQL()
    user: User,
  ) {
    const geolocation = await this.geolocationServices.createGeolocation({
      latitude,
      longitude,
      altitude,
      time,
      user,
    });
    pubSub.publish('geolocationCreated', { geolocationCreated: geolocation });
    return geolocation;
  }

  @Subscription('geolocationCreated')
  geolocationCreated() {
    return pubSub.asyncIterator('geolocationCreated');
  }
}
