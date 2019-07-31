import { Module } from '@nestjs/common';
import { DateScalar } from './date.scalar';

@Module({
  providers: [DateScalar],
})
export class CommonModule {}
