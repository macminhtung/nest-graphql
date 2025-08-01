import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from '@/modules/user/user.entity';
import { UserService } from '@/modules/user/user.service';
import { UserResolver } from '@/modules/user/user.resolver';
import { RoleEntity } from '@/modules/user/role/role.entity';
import { RoleService } from '@/modules/user/role/role.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity, RoleEntity])],
  providers: [UserResolver, UserService, RoleService],
  exports: [UserService, RoleService],
})
export class UserModule {}
