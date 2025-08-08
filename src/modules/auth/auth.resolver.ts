import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { HttpStatus } from '@nestjs/common';
import { Public } from '@/decorators';
import { AuthService } from '@/modules/auth/auth.service';
import { UserEntity } from '@/modules/user/user.entity';
import type { TRequest } from '@/common/types';
import type { FastifyReply } from 'fastify';
import {
  SignUpDto,
  SignInDto,
  SignInResponseDto,
  RefreshTokenDto,
  UpdatePasswordDto,
  UpdateProfileDto,
  GeneratePreSignedUrlDto,
} from '@/modules/auth/dtos';

@Resolver('auth')
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  // #================#
  // # ==> SIGNUP <== #
  // #================#
  @Public()
  @Mutation(() => UserEntity)
  signUp(@Args('payload') payload: SignUpDto) {
    return this.authService.signUp(payload);
  }

  // #================#
  // # ==> SIGNIN <== #
  // #================#
  @Public()
  @Mutation(() => SignInResponseDto)
  signIn(
    @Context() { reply }: { reply: FastifyReply },
    @Args('payload') payload: SignInDto,
  ): Promise<SignInResponseDto> {
    return this.authService.signIn(reply, payload);
  }

  // #=================#
  // # ==> SIGNOUT <== #
  // #=================#
  @Mutation(() => Number)
  signOut(@Context() { reply }: { reply: FastifyReply }): HttpStatus {
    return this.authService.signOut(reply);
  }

  // #=======================#
  // # ==> REFRESH TOKEN <== #
  // #=======================#
  @Public()
  @Mutation(() => SignInResponseDto)
  refreshToken(
    @Context() { req }: { req: TRequest },
    @Args('payload') payload: RefreshTokenDto,
  ): Promise<SignInResponseDto> {
    return this.authService.refreshToken(req, payload);
  }

  // #=========================#
  // # ==> UPDATE PASSWORD <== #
  // #=========================#
  @Mutation(() => SignInResponseDto)
  updatePassword(
    @Context() { req, reply }: { req: TRequest; reply: FastifyReply },
    @Args('payload') payload: UpdatePasswordDto,
  ): Promise<SignInResponseDto> {
    return this.authService.updatePassword(req, reply, payload);
  }

  // #=====================#
  // # ==> GET PROFILE <== #
  // #=====================#
  @Query(() => UserEntity)
  getProfile(@Context() { req }: { req: TRequest }): UserEntity {
    return this.authService.getProfile(req);
  }

  // #========================#
  // # ==> UPDATE PROFILE <== #
  // #========================#
  @Mutation(() => UserEntity)
  updateProfile(
    @Context() { req }: { req: TRequest },
    @Args('payload') payload: UpdateProfileDto,
  ): Promise<UserEntity> {
    return this.authService.updateProfile(req, payload);
  }

  // # =============================== #
  // # ==> GENERATE PRE-SIGNED URL <== #
  // # =============================== #
  @Mutation(() => String)
  generatePreSignedUrl(
    @Context() { req }: { req: TRequest },
    @Args('payload') payload: GeneratePreSignedUrlDto,
  ): Promise<string> {
    return this.authService.generatePreSignedUrl(req, payload);
  }
}
