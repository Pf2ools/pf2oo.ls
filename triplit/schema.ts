import { Schema as S } from '@triplit/client';

export const schema = S.Collections({
  todos: {
    schema: S.Schema({
      id: S.Id(),
      text: S.String(),
      complete: S.Boolean(),
      created_at: S.Date(),
      tags: S.Set(S.String()),
    }),
  },
  users: {
    schema: S.Schema({
      id: S.Id(),
      name: S.String(),
    }),
  },
});