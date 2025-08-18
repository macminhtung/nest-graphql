import { relations } from 'drizzle-orm';
import { uuid, integer, boolean, pgTable, varchar } from 'drizzle-orm/pg-core';
import { ETableName } from '@/common/enums';
import { BASE_COLUMNS } from '@/common/base.columns';
import { role } from '@/modules/user/role/role.schema';

export const user = pgTable(ETableName.USER, {
  id: uuid().primaryKey(),
  avatar: varchar().default('').notNull(),
  email: varchar().unique().notNull(),
  password: varchar().notNull(),
  passwordTimestamp: varchar().default(new Date().valueOf().toString()).notNull(),
  firstName: varchar({ length: 100 }).notNull(),
  lastName: varchar({ length: 100 }).notNull(),
  isEmailVerified: boolean().default(false).notNull(),
  roleId: integer().notNull(),
  ...BASE_COLUMNS,
});

export const userRelations = relations(user, ({ one }) => ({
  role: one(role, { fields: [user.roleId], references: [role.id] }),
}));
