import { Static, Type } from "@sinclair/typebox";

export const Director = Type.Object({
  id: Type.String({ minLength: 21, maxLength: 21 }),
  numero_pelicula: Type.Integer(),
});

export type DirectorType = Static<typeof Director>;
