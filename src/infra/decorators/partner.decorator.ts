import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CurrentPartner = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    const partner = request.partner;

    return partner;
  },
);
