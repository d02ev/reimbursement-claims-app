import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { DatabaseModule } from 'src/database/database.module';
import { JwtStrategy } from './strategy';

@Module({
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService],
  imports: [UserModule, DatabaseModule],
})
export class AuthModule {}
