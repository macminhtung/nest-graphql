import { Injectable } from '@nestjs/common';
import { BaseService } from '@/common/base.service';
import { ETableName } from '@/common/enums';

@Injectable()
export class RoleService extends BaseService<ETableName.ROLE> {}
