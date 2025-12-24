import { Module } from '@nestjs/common';
import { AuthService } from '@/modules/auth/auth.service';
import { AuthResolver } from '@/modules/auth/auth.resolver';
import { UserModule } from '@/modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/modules/user/user.entity';
import { RedisCacheModule } from '@/modules/redis-cache/redis-cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity]), UserModule, RedisCacheModule],
  providers: [AuthResolver, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
