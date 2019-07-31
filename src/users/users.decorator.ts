// thanks to grahan
// https://stackoverflow.com/questions/55269777/nestjs-get-current-user-in-graphql-resolver-authenticated-with-jwt/55270391#55270391

import { createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator((data: string, req) => {
  return data ? req.user && req.user[data] : req.user;
});

export const UserGql = createParamDecorator(
  (data, [root, args, ctx, info]) => ctx.req.user,
);
