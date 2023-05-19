import { Static, Type } from "@sinclair/typebox";

export const Persona = Type.Object({
  nombre: Type.String({ maxLength: 50 }),
  apellido_m: Type.String({ maxLength: 50 }),
  apellido_p: Type.String({ maxLength: 50 }),
  nacionalidad: Type.String({ maxLength: 40 }),
  genero: Type.String({
    maxLength: 1,
  }),
  id: Type.Optional(Type.String({ minLength: 21, maxLength: 21 })),
});

export type PersonaType = Static<typeof Persona>;
