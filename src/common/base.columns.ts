import { timestamp } from 'drizzle-orm/pg-core';

export const BASE_COLUMNS = {
  createdAt: timestamp({ withTimezone: false }).defaultNow().notNull(),
  updatedAt: timestamp({ withTimezone: false })
    .$onUpdate(() => new Date())
    .defaultNow()
    .notNull(),
  deletedAt: timestamp({ withTimezone: false }),
};
