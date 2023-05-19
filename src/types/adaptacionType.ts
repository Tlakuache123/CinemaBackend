import { Static, Type } from "@sinclair/typebox";

export const Adaptacion = Type.Object({
  id: Type.Optional(Type.String({ minLength: 21, maxLength: 21 })),
  id_pelicula: Type.String({ minLength: 21, maxLength: 21 }),
  idioma: Type.String({ maxLength: 20 }),
  nombre_adaptado: Type.String({ maxLength: 255 }),
  doblaje: Type.String({ maxLength: 2 }),
});

export type AdaptacionType = Static<typeof Adaptacion>;
