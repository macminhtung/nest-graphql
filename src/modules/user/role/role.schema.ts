import { pgTable, serial, pgEnum, varchar } from 'drizzle-orm/pg-core';
import { ETableName, ERoleName } from '@/common/enums';
import { BASE_COLUMNS } from '@/common/base.columns';

export const roleNameEnum = pgEnum(ETableName.ROLE, [
  ERoleName.ADMIN,
  ERoleName.STAFF,
  ERoleName.USER,
]);

export const role = pgTable(ETableName.ROLE, {
  id: serial().primaryKey(),
  name: roleNameEnum().default(ERoleName.USER).notNull(),
  description: varchar({ length: 200 }),
  ...BASE_COLUMNS,
});
