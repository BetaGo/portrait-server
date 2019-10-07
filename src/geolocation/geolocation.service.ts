import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Geolocation } from './geolocation.entity';
import { Between, DeepPartial, Repository } from 'typeorm';

@Injectable()
export class GeolocationService {
  constructor(
    @InjectRepository(Geolocation)
    private readonly geolocationRepository: Repository<Geolocation>,
  ) {}

  async getGeolocationByDateRange(from: Date, to: Date) {
    return this.geolocationRepository.find({
      where: {
        time: Between(from, to),
      },
      order: {
        time: 'DESC',
      },
    });
  }

  async createGeolocation(geolocation: DeepPartial<Geolocation>) {
    const newGeolocation = this.geolocationRepository.create(geolocation);
    return this.geolocationRepository.save(newGeolocation);
  }

  async getLatestGeolocation() {
    return this.geolocationRepository.findOne({
      order: {
        time: 'DESC',
      },
    });
  }
}
