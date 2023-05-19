import { Static, Type } from "@sinclair/typebox";

export const Pelicula = Type.Object({
  id: Type.Optional(Type.String({ minLength: 21, maxLength: 21 })),
  nombre: Type.String({ maxLength: 225 }),
  tipo_guion: Type.String({ maxLength: 20 }),
  anio: Type.Number(),
  id_pais: Type.String({ minLength: 21, maxLength: 21 }),
  sipnosis: Type.String(),
  fecha_estreno: Type.String(),
  duracion: Type.String(),
  clasificacion: Type.String({ maxLength: 20 }),
  idioma: Type.String({ maxLength: 20 }),
});

export type PeliculaType = Static<typeof Pelicula>;
