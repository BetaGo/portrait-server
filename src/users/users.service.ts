import { Injectable } from '@nestjs/common';
import { Repository, DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, UserDomain } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   *  从第三方登陆的账号中查出一个
   * @param uid 第三方登录提供的唯一 id
   * @param domain
   */
  async findOneInThirdLogin(
    uid: string,
    domain: UserDomain,
  ): Promise<User | undefined> {
    return this.userRepository.findOne({
      uid,
      domain,
    });
  }

  async update(id: number, data: Partial<User>) {
    return this.userRepository.update(id, data);
  }

  async isExist(params: Partial<User>) {
    let res = await this.userRepository.findOne(params);
    return !!res;
  }

  async findOne(params: Partial<User>) {
    return this.userRepository.findOne(params);
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.userRepository.findOne(id);
  }

  async create(user: DeepPartial<User>): Promise<User> {
    const newUser = this.userRepository.create(user);
    return this.userRepository.save(newUser);
  }
}
