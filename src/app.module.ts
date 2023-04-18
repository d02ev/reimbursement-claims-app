import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './auth/auth.module';
import { ClaimModule } from './claim/claim.module';
import { APP_GUARD } from '@nestjs/core';
import { RoleGuard } from './auth/guards';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd() + '/client/dist/client'),
    }),
    JwtModule.register({ global: true }),
    UserModule,
    DatabaseModule,
    AuthModule,
    ClaimModule,
  ],
  controllers: [AppController],
  providers: [AppService, { provide: APP_GUARD, useClass: RoleGuard }],
})
export class AppModule {}
