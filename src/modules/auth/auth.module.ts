import { Module } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { AuthResolver } from '@/modules/auth/auth.resolver';
import { UserModule } from '@/modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/modules/user/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserModule],
  providers: [AuthResolver, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
