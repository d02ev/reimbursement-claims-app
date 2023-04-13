import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'src/database/database.module';
import { LocalStrategy } from './strategy';
import { SessionSerializer } from './serializer';

@Module({
  providers: [AuthService, LocalStrategy, SessionSerializer],
  controllers: [AuthController],
  exports: [AuthService],
  imports: [
    UserModule,
    DatabaseModule,
    PassportModule.register({ session: true }),
  ],
})
export class AuthModule {}
