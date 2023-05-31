import { FastifyInstance } from "fastify";
import { EstudioType, Estudio } from "./../types/estudioType";
import { IdType, Id } from "./../types/idType";
import { nanoid } from "nanoid";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const estudioRoute: FastifyPluginAsyncTypebox = async (
  fastify: FastifyInstance,
  _options: any
) => {
  fastify.get("/", async (_req, _res) => {
    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query("SELECT * FROM vista_estudios");
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
          "SELECT * FROM estudio WHERE id_estudio = $1",
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

  fastify.post<{ Body: EstudioType; Reply: EstudioType }>(
    "/",
    {
      schema: {
        body: Estudio,
        response: {
          200: Estudio,
        },
      },
    },
    (req, res) => {
      let { nombre_estudio } = req.body;
      nombre_estudio = nombre_estudio.toLowerCase();
      const id: string = nanoid();
      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "INSERT INTO estudio(id_estudio, nombre_estudio) VALUES($1, $2)",
          [id, nombre_estudio],
          (err: any, _result: any) => {
            release();
            res.send(err || { id, nombre_estudio });
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
          "DELETE FROM estudio WHERE id_estudio = $1",
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

  fastify.put<{ Body: EstudioType; Reply: EstudioType }>(
    "/",
    {
      schema: {
        body: Id,
      },
    },
    (req, res) => {
      let { nombre_estudio, id } = req.body;
      nombre_estudio = nombre_estudio.toLowerCase();

      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "UPDATE estudio SET nombre_estudio = $1 WHERE id_estudio = $2",
          [nombre_estudio, id],
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

export default estudioRoute;
