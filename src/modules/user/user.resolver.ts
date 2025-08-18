import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { ETableName, ERoleName } from '@/common/enums';
import { PaginatedResponseDto } from '@/common/dtos';
import { Roles } from '@/decorators';
import { UserService } from '@/modules/user/user.service';
import {
  UpdateUserDto,
  GetUsersPaginatedDto,
  UserResponseDto,
  PaginatedUsersResponseDto,
} from '@/modules/user/dtos';

@Resolver(ETableName.USER)
export class UserResolver {
  constructor(private readonly userService: UserService) {}

  // #=====================#
  // # ==> UPDATE USER <== #
  // #=====================#
  @Roles([ERoleName.ADMIN])
  @Mutation(() => UserResponseDto)
  updateUser(
    @Args('id') id: string,
    @Args('payload') payload: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.userService.updateUser(id, payload);
  }

  // #==================#
  // # ==> GET USER <== #
  // #==================#
  @Roles([ERoleName.ADMIN])
  @Query(() => UserResponseDto)
  getUser(@Args('id') id: string): Promise<UserResponseDto> {
    return this.userService.getUser(id);
  }

  // #=============================#
  // # ==> GET PAGINATED USERS <== #
  // #=============================#
  @Roles([ERoleName.ADMIN])
  @Query(() => PaginatedUsersResponseDto)
  getPaginatedUsers(
    @Args('queryParams') queryParams: GetUsersPaginatedDto,
  ): Promise<PaginatedResponseDto<UserResponseDto>> {
    return this.userService.getPaginatedUsers(queryParams);
  }
}
