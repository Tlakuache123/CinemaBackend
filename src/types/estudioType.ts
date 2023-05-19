import { Static, Type } from "@sinclair/typebox";

export const Estudio = Type.Object({
  id: Type.Optional(Type.String({ minLength: 21, maxLength: 21 })),
  nombre_estudio: Type.String({ maxLength: 40 }),
});

export type EstudioType = Static<typeof Estudio>;
