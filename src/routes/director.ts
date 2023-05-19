import { FastifyInstance } from "fastify";
import { DirectorType, Director } from "./../types/directorType";
import { IdType, Id } from "./../types/idType";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const directorRoute: FastifyPluginAsyncTypebox = async (
  fastify: FastifyInstance,
  _options: any
) => {
  fastify.get("/", async (_req, _res) => {
    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query("SELECT * FROM director");
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
          "SELECT * FROM director WHERE id_persona = $1",
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

  fastify.get("/full", async (_req, _res) => {
    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query(
        "SELECT * FROM director dic JOIN persona pe ON dic.id_persona = pe.id_persona"
      );
      return rows;
    } catch (err) {
      return { error: err };
    } finally {
      client.release();
    }
  });

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
          "SELECT * FROM director dic JOIN persona pe ON dic.id_persona = pe.id_persona WHERE dic.id_persona = $1",
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

  fastify.post<{ Body: DirectorType; Reply: DirectorType }>(
    "/",
    {
      schema: {
        body: Director,
        response: {
          200: Director,
        },
      },
    },
    (req, res) => {
      let { id, numero_pelicula} = req.body;
      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "INSERT INTO director(id_persona, nro_peliculas) VALUES($1, $2)",
          [id, numero_pelicula],
          (err: any, _result: any) => {
            release();
            res.send(err || { id, numero_pelicula });
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
          "DELETE FROM director WHERE id_persona = $1",
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

  fastify.put<{ Body: DirectorType; Reply: DirectorType }>(
    "/",
    {
      schema: {
        body: Director,
      },
    },
    (req, res) => {
      let { id, numero_pelicula } = req.body;

      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "UPDATE actor SET nro_peliculas = $2 WHERE id_persona = $1",
          [id, numero_pelicula],
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

export default directorRoute;
