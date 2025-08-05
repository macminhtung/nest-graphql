import { Resolver, Query, Args, Mutation, Context } from '@nestjs/graphql';
import { HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { Public } from '@/decorators';
import { AuthService } from '@/modules/auth/auth.service';
import { UserEntity } from '@/modules/user/user.entity';
import type { TRequest } from '@/common/types';
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
    @Context() { res }: { res: Response },
    @Args('payload') payload: SignInDto,
  ): Promise<SignInResponseDto> {
    return this.authService.signIn(res, payload);
  }

  // #=================#
  // # ==> SIGNOUT <== #
  // #=================#
  @Mutation(() => Number)
  signOut(@Context() { res }: { res: Response }): HttpStatus {
    return this.authService.signOut(res);
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
    @Context() { req, res }: { req: TRequest; res: Response },
    @Args('payload') payload: UpdatePasswordDto,
  ): Promise<SignInResponseDto> {
    return this.authService.updatePassword(req, res, payload);
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
