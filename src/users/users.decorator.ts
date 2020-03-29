import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    return data ? req.user && req.user[data] : req.user;
  },
);

export const UserGQL = createParamDecorator(
  (data: string, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;
    // const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);

// export const UserGQL = createParamDecorator((data, [root, args, ctx, info]) => {
//   return ctx.req.user;
// });
