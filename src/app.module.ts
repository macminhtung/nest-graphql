import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { typeormConfig } from '@/config';
import { loadENVsFunc, ENV_VALIDATION } from '@/config';
import { ApiLoggingInterceptor } from '@/interceptors';
import { AuthGuard } from '@/guards';
import { ApiExceptionsFilter } from '@/filters';
import { ApiValidationPipe } from '@/pipes';
import { AuthModule } from '@/modules/auth/auth.module';
import { UserModule } from '@/modules/user/user.module';
import { ProductModule } from '@/modules/product/product.module';
import { SharedModule } from '@/modules/shared/shared.module';
import { ElasticModule } from '@/modules/elastic/elastic.module';

@Module({
  imports: [
    // #=======================#
    // # ==> CONFIG MODULE <== #
    // #=======================#
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : '.env',
      load: [loadENVsFunc],
      validationSchema: ENV_VALIDATION,
    }),

    // #=======================#
    // # ==> APOLLO MODULE <== #
    // #=======================#
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: true,
      context: ({ req, res }) => ({ req, res }),
    }),

    // #==============================#
    // # ==> ELASTICSEARCH MODULE <== #
    // #==============================#
    ElasticModule,

    // #=========================#
    // # ==> TYPE_ORM MODULE <== #
    // #=========================#
    TypeOrmModule.forRoot(typeormConfig),

    SharedModule,
    UserModule,
    AuthModule,
    ProductModule,
  ],
  providers: [
    // #===================================#
    // # ==> [INTERCEPTOR] API LOGGING <== #
    // #===================================#
    { provide: APP_INTERCEPTOR, useClass: ApiLoggingInterceptor },

    // #================================#
    // # ==> [FILTER] API EXCEPTION <== #
    // #================================#
    { provide: APP_FILTER, useClass: ApiExceptionsFilter },

    // #===============================#
    // # ==> [PIPE] API VALIDATION <== #
    // #===============================#
    { provide: APP_PIPE, useClass: ApiValidationPipe },

    // #====================================#
    // # ==> [GUARD] API AUTHENTICATION <== #
    // #====================================#
    { provide: APP_GUARD, useClass: AuthGuard },
  ],
})
export class AppModule {}
