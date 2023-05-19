import { Static, Type } from "@sinclair/typebox";

export const Cancion = Type.Object({
  nombre: Type.String({ maxLength: 50 }),
  genero: Type.String({ maxLength: 50 }),
  duracion: Type.String(),
});

export type CancionType = Static<typeof Cancion>;
