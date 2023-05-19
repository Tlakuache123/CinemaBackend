import { Static, Type } from "@sinclair/typebox";

export const Pais = Type.Object({
  nombre: Type.String(),
  id: Type.Optional(Type.String({ minLength: 21, maxLength: 21 })),
});

export type PaisType = Static<typeof Pais>;
