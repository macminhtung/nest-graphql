import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/modules/user/user.entity';
import { UserService } from '@/modules/user/user.service';
import { UserResolver } from '@/modules/user/user.resolver';
import { RoleEntity } from '@/modules/user/role/role.entity';
import { RoleService } from '@/modules/user/role/role.service';
import { RoleLoader } from '@/modules/user/role/role.loader';
import { UserTokenEntity } from '@/modules/user/user-token/user-token.entity';
import { UserTokenService } from '@/modules/user/user-token/user-token.service';
import { RedisCacheModule } from '@/modules/redis-cache/redis-cache.module';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity, UserTokenEntity]), RedisCacheModule],
  providers: [UserResolver, UserService, RoleService, RoleLoader, UserTokenService],
  exports: [UserService, RoleService, UserTokenService],
})
export class UserModule {}
