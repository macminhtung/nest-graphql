import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UserEntity } from '@/modules/user/user.entity';
import { UserService } from '@/modules/user/user.service';
import { UserResolver } from '@/modules/user/user.resolver';
import { RoleEntity } from '@/modules/user/role/role.entity';
import { RoleService } from '@/modules/user/role/role.service';
import { UserTokenEntity } from '@/modules/user/user-token/user-token.entity';
import { UserTokenService } from '@/modules/user/user-token/user-token.service';

@Module({
  imports: [MikroOrmModule.forFeature([UserEntity, RoleEntity, UserTokenEntity])],
  providers: [UserResolver, UserService, RoleService, UserTokenService],
  exports: [UserService, RoleService, UserTokenService],
})
export class UserModule {}
