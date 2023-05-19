import { FastifyInstance } from "fastify";
import { GuionistaType, Guionista } from "./../types/guionistaType";
import { IdType, Id } from "./../types/idType";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const guionistaRoute: FastifyPluginAsyncTypebox = async (
  fastify: FastifyInstance,
  _options: any
) => {
  fastify.get("/", async (_req, _res) => {
    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query("SELECT * FROM guionista");
      return rows;
    } catch (err) {
      return { error: err };
    } finally {
      client.release();
    }
  });

  fastify.get("/full", async (_req, _res) => {
    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query(
        "SELECT * FROM guionista gui JOIN persona pe ON gui.id_persona = pe.id_persona"
      );
      return rows;
    } catch (err) {
      return { error: err };
    } finally {
      client.release();
    }
  });

  fastify.get(
    "/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
        },
      },
    },
    async (req, _res) => {
      const { id } = req.params as IdType;
      const client = await fastify.pg.connect();
      try {
        const { rows } = await client.query(
          "SELECT * FROM guionista WHERE id_persona = $1",
          [id]
        );
        return rows;
      } catch (err) {
        return { error: err };
      } finally {
        client.release();
      }
    }
  );

  fastify.get(
    "/full/:id",
    {
      schema: {
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
        },
      },
    },
    async (req, _res) => {
      const { id } = req.params as IdType;
      const client = await fastify.pg.connect();
      try {
        const { rows } = await client.query(
          "SELECT * FROM guionista gui JOIN persona pe ON gui.id_persona = pe.id_persona WHERE gui.id_persona = $1",
          [id]
        );
        return rows;
      } catch (err) {
        return { error: err };
      } finally {
        client.release();
      }
    }
  );

  fastify.post<{ Body: GuionistaType; Reply: GuionistaType }>(
    "/",
    {
      schema: {
        body: Guionista,
        response: {
          200: Guionista,
        },
      },
    },
    (req, res) => {
      let { id, salario } = req.body;
      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "INSERT INTO guionista(id_persona, salario) VALUES($1, $2)",
          [id, salario],
          (err: any, _result: any) => {
            release();
            res.send(err || { id, salario });
          }
        );
      };

      fastify.pg.connect(onConnect);
    }
  );

  fastify.delete<{ Body: IdType }>(
    "/",
    {
      schema: {
        body: Id,
      },
    },
    (req, res) => {
      let { id } = req.body;
      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "DELETE FROM guionista WHERE id_estudio = $1",
          [id],
          (err: any, _result: any) => {
            release();
            if (err) {
              res.send(err);
            } else {
              res.send().code(204);
            }
          }
        );
      };

      fastify.pg.connect(onConnect);
    }
  );

  fastify.put<{ Body: GuionistaType; Reply: GuionistaType }>(
    "/",
    {
      schema: {
        body: Id,
      },
    },
    (req, res) => {
      let { id, salario} = req.body;

      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "UPDATE estudio SET nombre_estudio = $1 WHERE id_estudio = $2",
          [salario, id],
          (err: any, _result: any) => {
            release();
            if (err) {
              res.send(err);
            } else {
              res.send().code(200);
            }
          }
        );
      };

      fastify.pg.connect(onConnect);
    }
  );
};

export default guionistaRoute;
