import { Resolver, Query, Args, Mutation, ResolveField, Parent } from '@nestjs/graphql';
import { EEntity, ERoleName } from '@/common/enums';
import { PaginatedResponseDto } from '@/common/dtos';
import { Roles } from '@/decorators';
import { UserService } from '@/modules/user/user.service';
import { UserEntity } from '@/modules/user/user.entity';
import { RoleLoader } from '@/modules/user/role/role.loader';
import { RoleEntity } from '@/modules/user/role/role.entity';
import { UpdateUserDto, GetUsersPaginatedDto } from '@/modules/user/dtos';

@Resolver(EEntity.USER)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly roleLoader: RoleLoader,
  ) {}

  // #=====================#
  // # ==> UPDATE USER <== #
  // #=====================#
  @Roles([ERoleName.ADMIN])
  @Mutation(() => UserEntity)
  updateUser(@Args('id') id: string, @Args('payload') payload: UpdateUserDto): Promise<UserEntity> {
    return this.userService.updateUser(id, payload);
  }

  // #==================#
  // # ==> GET USER <== #
  // #==================#
  @Roles([ERoleName.ADMIN])
  @Query(() => UserEntity)
  getUser(@Args('id') id: string): Promise<UserEntity> {
    return this.userService.getUser(id);
  }

  // #=============================#
  // # ==> GET PAGINATED USERS <== #
  // #=============================#
  @Roles([ERoleName.ADMIN])
  @Query(() => PaginatedResponseDto<UserEntity>)
  getPaginatedUsers(
    @Args('queryParams') queryParams: GetUsersPaginatedDto,
  ): Promise<PaginatedResponseDto<UserEntity>> {
    return this.userService.getPaginatedUsers(queryParams);
  }

  // #=====================#
  // # ==> ROLE LOADER <== #
  // #=====================#
  @ResolveField(() => RoleEntity, { nullable: true })
  role(@Parent() user: UserEntity) {
    return this.roleLoader.load(user.roleId);
  }
}
