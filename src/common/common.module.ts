import { Module } from '@nestjs/common';
import { DateScalar } from './scalars/date.scalar';

@Module({
  providers: [DateScalar],
  exports: [DateScalar],
})
export class CommonModule {}
