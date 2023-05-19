import { FastifyInstance } from "fastify";
import { Soundtrack, SoundtrackType } from "./../types/soundtrackType";
import { IdType, Id } from "./../types/idType";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const soundtrackRoute: FastifyPluginAsyncTypebox = async (
  fastify: FastifyInstance,
  _options: any
) => {
  fastify.get("/", async (_req, _res) => {
    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query("SELECT * FROM soundtrack");
      return rows;
    } catch (err) {
      return { error: err };
    } finally {
      client.release();
    }
  });

  fastify.get(
    "/:id/pelicula",
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
          "SELECT * FROM soundtrack WHERE id_pelicula = $1",
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
    "/:id/cancion",
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
          "SELECT * FROM soundtrack WHERE nombre_cancion = $1",
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

  fastify.post<{ Body: SoundtrackType; Reply: SoundtrackType }>(
    "/",
    {
      schema: {
        body: Soundtrack,
        response: {
          200: Soundtrack,
        },
      },
    },
    (req, res) => {
      // Dando formato a persona
      let { id_pelicula, nombre_cancion } = req.body;
      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "INSERT INTO soundtrack(id_pelicula, nombre_cancion) VALUES($1,$2)",
          [id_pelicula, nombre_cancion],
          (err: any, _result: any) => {
            release();
            res.send(err || { id_pelicula, nombre_cancion });
          }
        );
      };

      fastify.pg.connect(onConnect);
    }
  );

  fastify.delete<{ Body: IdType }>(
    "/pelicula",
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
          "DELETE FROM persona WHERE id_pelicula = $1",
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

  fastify.delete<{ Body: IdType }>(
    "/cancion",
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
          "DELETE FROM persona WHERE nombre_cancion = $1",
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
};

export default soundtrackRoute;
