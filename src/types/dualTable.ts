import { Static, Type } from "@sinclair/typebox";

export const DualTable = Type.Object({
  main_id: Type.String(),
  second_id: Type.String()
});


export type dualTableType = Static<typeof DualTable>;
