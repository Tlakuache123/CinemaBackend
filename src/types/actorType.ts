import { Static, Type } from "@sinclair/typebox";

export const Actor = Type.Object({
  id: Type.String({ minLength: 21, maxLength: 21 }),
  numero_pelicula: Type.Integer(),
});

export type ActorType = Static<typeof Actor>;
