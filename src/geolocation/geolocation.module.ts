import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Geolocation } from './geolocation.entity';
import { GeolocationService } from './geolocation.service';
import { GeolocationResolver } from './geolocation.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Geolocation])],
  providers: [GeolocationService, GeolocationResolver],
  exports: [GeolocationService],
})
export class GeolocationModule {}
