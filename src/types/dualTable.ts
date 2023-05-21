import { Static, Type } from "@sinclair/typebox";

export const Soundtrack = Type.Object({
  id_pelicula: Type.String(),
  nombre_cancion: Type.String(),
});

export const PeliculaGuionista = Type.Object({
  id_pelicula: Type.String(),
  id_persona: Type.String(),
});

export const PeliculaEstudio = Type.Object({
  id_pelicula: Type.String(),
  id_estudio: Type.String(),
  financiamiento: Type.Optional(Type.Number()),
});

export const PeliculaGenero = Type.Object({
  id_pelicula: Type.String(),
  genero: Type.String(),
});

export const CancionPersona = Type.Object({
  nombre: Type.String(),
  artista: Type.String(),
});

export type SoundtrackType = Static<typeof Soundtrack>;
export type PeliculaGuionistaType = Static<typeof PeliculaGuionista>;
export type PeliculaEstudioType = Static<typeof PeliculaEstudio>;
export type PeliculaGeneroType = Static<typeof PeliculaGenero>;
export type CancionPersonaType = Static<typeof CancionPersona>;
