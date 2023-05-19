import { Static, Type } from "@sinclair/typebox";

export const Soundtrack = Type.Object({
  id_pelicula: Type.String({ minLength: 21, maxLength: 21 }),
  nombre_cancion: Type.String({ maxLength: 50 }),
});

export type SoundtrackType = Static<typeof Soundtrack>;
