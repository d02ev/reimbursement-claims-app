import { Module } from '@nestjs/common';
import { ClaimService } from './claim.service';
import { ClaimController } from './claim.controller';

@Module({
  providers: [ClaimService],
  controllers: [ClaimController]
})
export class ClaimModule {}
