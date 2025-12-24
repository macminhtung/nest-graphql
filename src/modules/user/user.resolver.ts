import { Resolver, Query, Args, Mutation, ResolveField, Parent, Context } from '@nestjs/graphql';
import { ParseUUIDPipe } from '@nestjs/common';
import { DEFAULT_ROLES } from '@/common/constants';
import { PaginatedResponseDto } from '@/common/dtos';
import { Roles } from '@/decorators';
import { UserService } from '@/modules/user/user.service';
import { UserEntity } from '@/modules/user/user.entity';
import { RoleLoader } from '@/modules/user/role/role.loader';
import { RoleEntity } from '@/modules/user/role/role.entity';
import {
  CreateUserDto,
  UpdateUserDto,
  GetUsersPaginatedDto,
  PaginatedUsersResponseDto,
} from '@/modules/user/dtos';
import type { TRequest } from '@/common/types';

@Resolver(() => UserEntity)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly roleLoader: RoleLoader,
  ) {}

  // #=====================#
  // # ==> CREATE USER <== #
  // #=====================#
  @Roles([DEFAULT_ROLES.ADMIN.id])
  @Mutation(() => UserEntity)
  createUser(@Args('payload') payload: CreateUserDto): Promise<UserEntity> {
    return this.userService.createUser(payload);
  }

  // #=====================#
  // # ==> UPDATE USER <== #
  // #=====================#
  @Roles([DEFAULT_ROLES.ADMIN.id])
  @Mutation(() => UserEntity)
  updateUser(
    @Args('id', ParseUUIDPipe) id: string,
    @Args('payload') payload: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.userService.updateUser(id, payload);
  }

  // #==================#
  // # ==> GET USER <== #
  // #==================#
  @Roles([DEFAULT_ROLES.ADMIN.id])
  @Query(() => UserEntity)
  getUser(@Args('id', ParseUUIDPipe) id: string): Promise<UserEntity> {
    return this.userService.getUser(id);
  }

  // #=============================#
  // # ==> GET PAGINATED USERS <== #
  // #=============================#
  @Roles([DEFAULT_ROLES.ADMIN.id])
  @Query(() => PaginatedUsersResponseDto)
  getPaginatedUsers(
    @Args('queryParams') queryParams: GetUsersPaginatedDto,
  ): Promise<PaginatedResponseDto<UserEntity>> {
    return this.userService.getPaginatedUsers(queryParams);
  }

  // #=====================#
  // # ==> DELETE USER <== #
  // #=====================#
  @Roles([DEFAULT_ROLES.ADMIN.id])
  @Mutation(() => String)
  deleteUser(
    @Context() { req }: { req: TRequest },
    @Args('id', ParseUUIDPipe) id: string,
  ): Promise<string> {
    return this.userService.deleteUser(req.authUser, id);
  }

  // #=====================#
  // # ==> ROLE LOADER <== #
  // #=====================#
  @ResolveField(() => RoleEntity, { nullable: true })
  role(@Parent() user: UserEntity) {
    return this.roleLoader.load(user.roleId);
  }
}
