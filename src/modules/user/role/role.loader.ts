import { Injectable, Scope } from '@nestjs/common';
import DataLoader from 'dataloader';
import { RoleService } from '@/modules/user/role/role.service';
import { RoleEntity } from '@/modules/user/role/role.entity';

@Injectable({ scope: Scope.REQUEST })
export class RoleLoader {
  constructor(private roleService: RoleService) {}

  public readonly loader = new DataLoader<number, RoleEntity>(async (roleIds: number[]) => {
    const roles = await this.roleService.findByIds([...roleIds]);

    const roleMap = new Map(roles.map((role) => [role.id, role]));

    return roleIds.map((id) => roleMap.get(id)!);
  });

  load(roleId: number) {
    return this.loader.load(roleId);
  }
}
