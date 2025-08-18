import { Injectable } from '@nestjs/common';
import { eq, inArray, or, ilike } from 'drizzle-orm';
import { BaseService } from '@/common/base.service';
import { ETableName } from '@/common/enums';
import { user } from '@/modules/user/user.schema';
import { role } from '@/modules/user/role/role.schema';
import { UpdateUserDto, GetUsersPaginatedDto } from '@/modules/user/dtos';

@Injectable()
export class UserService extends BaseService<ETableName.USER> {
  // #=====================#
  // # ==> UPDATE USER <== #
  // #=====================#
  async updateUser(id: string, payload: UpdateUserDto) {
    // Check the user already exists
    const existedUser = await this.checkExist({ findOpts: { where: eq(user.id, id) } });

    // Update the user
    await this.database.update(user).set(payload).where(eq(user.id, id));

    return { ...existedUser, ...payload };
  }

  // #==================#
  // # ==> GET USER <== #
  // #==================#
  async getUser(id: string) {
    const existedUser = await this.checkExist({
      findOpts: { where: eq(user.id, id), with: { role: true } },
    });

    return existedUser;
  }

  // #=============================#
  // # ==> GET PAGINATED USERS <== #
  // #=============================#
  async getPaginatedUsers(queryParams: GetUsersPaginatedDto) {
    const paginationData = await this.getPaginatedRecords(
      {
        ...queryParams,
      },
      (selectQuery) => {
        const { keySearch, roleIds } = queryParams;

        selectQuery.innerJoin(role, eq(user.roleId, role.id));

        // Filter based on roleIds
        if (roleIds?.length) selectQuery.where(inArray(user.roleId, roleIds));

        // Query based on keySearch
        if (keySearch)
          selectQuery.where(
            or(ilike(user.firstName, `%${keySearch}%`), ilike(user.lastName, `%${keySearch}%`)),
          );
      },
    );

    return paginationData;
  }
}
