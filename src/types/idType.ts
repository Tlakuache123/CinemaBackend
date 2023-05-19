import { Static, Type } from "@sinclair/typebox";

export const Id = Type.Object({
  id: Type.String({ minLength: 21, maxLength: 21 }),
});

export const LongId = Type.Object({
  id: Type.String(),
});

export type IdType = Static<typeof Id>;
export type LongIdType = Static<typeof LongId>;
