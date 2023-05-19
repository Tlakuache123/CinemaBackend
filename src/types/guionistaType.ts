import { Static, Type } from "@sinclair/typebox";

export const Guionista = Type.Object({
  id: Type.String({ minLength: 21, maxLength: 21 }),
  salario: Type.Number(),
});

export type GuionistaType = Static<typeof Guionista>;
