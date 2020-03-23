import { Injectable } from '@nestjs/common';
import { Repository, DeepPartial } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User, ThirdLoginType } from './users.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  /**
   *  从第三方登陆的账号中查出一个
   * @param thirdLoginId 第三方登录提供的唯一 id
   * @param ThirdLoginType
   */
  async findOneInThirdLogin(
    thirdLoginId: string,
    thirdLoginType: ThirdLoginType,
  ): Promise<User | undefined> {
    return this.userRepository.findOne({
      thirdLoginId,
      thirdLoginType,
    });
  }

  async update(id: number, data: Partial<User>) {
    // 假如传来的参数 instanceof Object 为 false 会导致 typeorm 报错，所以这里需要解构一下
    // 详见: https://github.com/typeorm/typeorm/issues/679#issuecomment-397974558
    return this.userRepository.update(id, { ...data });
  }

  async isExist(params: Partial<User>) {
    const res = await this.userRepository.findOne(params);
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
