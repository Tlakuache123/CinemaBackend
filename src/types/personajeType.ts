import { Static, Type } from "@sinclair/typebox";

export const Personaje = Type.Object({
  personaje: Type.String({ maxLength: 50 }),
  id_pelicula: Type.String({ minLength: 21, maxLength: 21 }),
  tipo_personaje: Type.String({ maxLength: 30 }),
  descripcion: Type.String(),
  id_persona: Type.String({ minLength: 21, maxLength: 21 }),
});

export const PersonajeId = Type.Object({
  personaje: Type.String({ maxLength: 50 }),
  id_pelicula: Type.String({ minLength: 21, maxLength: 21 }),
});

export type PersonajeType = Static<typeof Personaje>;
export type PersonajeIdType = Static<typeof PersonajeId>;
