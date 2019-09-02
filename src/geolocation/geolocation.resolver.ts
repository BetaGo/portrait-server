import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { GQLAuthGuard } from '../auth/graphql-auth-guard.service';
import { GeolocationService } from './geolocation.service';
import { CreateGeolocationDto } from './dto/create-geolocation';
import { UserGQL } from '../users/users.decorator';
import { User } from '../users/users.entity';

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
  createGeolocation(
    @Args('createGeolocationInput')
    geolocation: CreateGeolocationDto,

    @UserGQL()
    user: User,
  ) {
    return this.geolocationServices.createGeolocation({...geolocation, user});
  }
}
