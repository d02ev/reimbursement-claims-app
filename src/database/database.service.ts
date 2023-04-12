import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService extends PrismaClient {
  constructor(private readonly _configService: ConfigService) {
    super({
      datasources: {
        db: {
          url: _configService.get('DATABASE_URL'),
        },
      },
    });
  }

  cleanDb() {
    return this.$transaction([this.user.deleteMany(), this.claim.deleteMany()]);
  }
}
