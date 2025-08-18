import { Module } from '@nestjs/common';
import { drizzle } from 'drizzle-orm/node-postgres';
import { ConfigService } from '@nestjs/config';
import { Pool } from 'pg';
import type { TEnvConfiguration } from '@/config';
import { role } from '@/modules/user/role/role.schema';
import { user, userRelations } from '@/modules/user/user.schema';

export const DATABASE_INJECT_TOKEN = 'DATABASE_INJECT_TOKEN';
export const SCHEMA = { role, user, userRelations };

@Module({
  providers: [
    {
      provide: DATABASE_INJECT_TOKEN,
      inject: [ConfigService],
      useFactory: (configService: ConfigService<TEnvConfiguration>) => {
        const dbConfig = configService.get<TEnvConfiguration['database']>('database')!;
        const pool = new Pool({ ...dbConfig, max: 50 });
        return drizzle(pool, { schema: SCHEMA, casing: 'camelCase' });
      },
    },
  ],
  exports: [DATABASE_INJECT_TOKEN],
})
export class DatabaseModule {}
