import { MikroOrmModuleOptions } from '@mikro-orm/nestjs';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { MikroORMNamingStrategy } from '@/modules/mikro-orm/mikro-orm.naming';
import { Migrator } from '@mikro-orm/migrations';
import * as dotenv from 'dotenv';

dotenv.config({ path: process.env.NODE_ENV ? `.${process.env.NODE_ENV}.env` : '.env' });

const config: MikroOrmModuleOptions = {
  driver: PostgreSqlDriver,
  namingStrategy: MikroORMNamingStrategy,
  extensions: [Migrator],
  entities: ['src/modules/**/*.entity{.ts,.js}'],
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT) || 5432,
  user: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASSWORD,
  dbName: process.env.POSTGRES_DATABASE,
  migrations: { pathTs: 'src/migrations', glob: '!(*.d).{js,ts}' },
};

export default config;
