import { Module } from '@nestjs/common';
import { UserService } from '@/modules/user/user.service';
import { UserResolver } from '@/modules/user/user.resolver';
import { RoleService } from '@/modules/user/role/role.service';

@Module({
  providers: [UserResolver, UserService, RoleService],
  exports: [UserService, RoleService],
})
export class UserModule {}
