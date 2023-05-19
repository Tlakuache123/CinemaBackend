import { FastifyInstance } from "fastify";
import { Cancion, CancionType } from "./../types/cancionType";
import { IdType, Id } from "./../types/idType";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const cancionRoute: FastifyPluginAsyncTypebox = async (
  fastify: FastifyInstance,
  _options: any
) => {
  fastify.get("/", async (_req, _res) => {
    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query("SELECT * FROM cancion");
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
          "SELECT * FROM cancion WHERE nombre = $1",
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

  fastify.post<{ Body: CancionType; Reply: CancionType }>(
    "/",
    {
      schema: {
        body: Cancion,
        response: {
          200: Cancion,
        },
      },
    },
    (req, res) => {
      let { nombre, genero, duracion } = req.body;
      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "INSERT INTO cancion(nombre, genero, duracion) VALUES($1,$2,$3)",
          [nombre, genero, duracion],
          (err: any, _result: any) => {
            release();
            res.send(err || { nombre, genero, duracion });
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
          "DELETE FROM cancion WHERE nombre = $1",
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

  fastify.put<{ Body: CancionType; Reply: CancionType }>(
    "/",
    {
      schema: {
        body: Cancion,
      },
    },
    (req, res) => {
      let { nombre, genero, duracion } = req.body;

      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "UPDATE cancion SET (genero,duracion) = ($2,$3) WHERE nombre = $1",
          [nombre, genero, duracion],
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

export default cancionRoute;
