import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { TRequest } from '@/common/types';
import { EMetadataKey } from '@/common/enums';
import { AuthService } from '@/modules/auth/auth.service';
import { ETokenType } from '@/modules/shared/services';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get token from originReq
    const req: TRequest = context.getArgs()[2].req;
    const accessToken = req.headers.authorization?.replace('Bearer ', '') || '';

    // #======================#
    // # ==> CASE: PUBLIC <== #
    // #======================#
    const isPublic = this.reflector.get<boolean>(EMetadataKey.PUBLIC, context.getHandler());
    if (isPublic && !accessToken) return true;

    // #==================================#
    // # ==> CASE: CHECK ACCESS TOKEN <== #
    // #==================================#
    const authUser = await this.authService.checkToken({
      type: ETokenType.ACCESS_TOKEN,
      token: accessToken,
    });

    // Update authUser and cookies for the request
    req.authUser = authUser;

    return true;
  }
}
