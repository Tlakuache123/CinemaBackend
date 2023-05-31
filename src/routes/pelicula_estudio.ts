import { FastifyInstance } from "fastify";
import { PeliculaEstudio, PeliculaEstudioType } from "./../types/dualTable";
import { Id, IdType, LongId, LongIdType } from "../types/idType";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const peliculaEstudioRoute: FastifyPluginAsyncTypebox = async (
  fastify: FastifyInstance,
  _options: any
) => {
  fastify.get("/", async (_req, _res) => {
    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query("SELECT * FROM pelicula_estudio");
      return rows;
    } catch (err) {
      return { error: err };
    } finally {
      client.release();
    }
  });

  fastify.get(
    "/:id_pelicula/:id_estudio",
    {
      schema: {
        params: PeliculaEstudio,
      },
    },
    async (req, _res) => {
      const { id_pelicula, id_estudio } = req.params as PeliculaEstudioType;
      const client = await fastify.pg.connect();
      try {
        const { rows } = await client.query(
          "SELECT * FROM pelicula_estudio WHERE id_pelicula = $1 AND id_estudio = $2",
          [id_pelicula, id_estudio]
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
    "/:id/pelicula",
    {
      schema: {
        params: Id,
      },
    },
    async (req, _res) => {
      const { id } = req.params as IdType;
      const client = await fastify.pg.connect();
      try {
        const { rows } = await client.query(
          "SELECT * FROM pelicula_estudio WHERE id_pelicula = $1",
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
    "/:id/estudio",
    {
      schema: {
        params: LongId,
      },
    },
    async (req, _res) => {
      const { id } = req.params as LongIdType;
      const client = await fastify.pg.connect();
      try {
        const { rows } = await client.query(
          `SELECT * 
          FROM pelicula_estudio pe_es
          JOIN pelicula pe ON pe_es.id_pelicula = pe.id_pelicula
          WHERE pe_es.id_estudio = $1`,
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
        `
SELECT * 
FROM pelicula_estudio AS pees
JOIN pelicula AS pe ON pees.id_pelicula = pe.id_pelicula
JOIN estudio AS es ON pees.id_estudio = es.id_estudio`
      );
      return rows;
    } catch (err) {
      return { error: err };
    } finally {
      client.release();
    }
  });

  fastify.get(
    "/full/:id_pelicula/:id_estudio",
    {
      schema: {
        params: PeliculaEstudio,
      },
    },
    async (req, _res) => {
      const { id_pelicula, id_estudio } = req.params as PeliculaEstudioType;
      const client = await fastify.pg.connect();
      try {
        const { rows } = await client.query(
          `
SELECT * 
FROM pelicula_estudio AS pees
JOIN pelicula AS pe ON pees.id_pelicula = pe.id_pelicula
JOIN estudio AS es ON pees.id_estudio = es.id_estudio
WHERE pees.id_pelicula = $1 AND pees.id_estudio = $2`,
          [id_pelicula, id_estudio]
        );
        return rows;
      } catch (err) {
        return { error: err };
      } finally {
        client.release();
      }
    }
  );

  fastify.post<{ Body: PeliculaEstudioType; Reply: PeliculaEstudioType }>(
    "/",
    {
      schema: {
        body: PeliculaEstudio,
        response: {
          200: PeliculaEstudio,
        },
      },
    },
    (req, res) => {
      let { id_pelicula, id_estudio } = req.body;
      let financiamiento = req.body.financiamiento || 0;

      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "INSERT INTO pelicula_estudio(id_pelicula, id_estudio, financiamiento) VALUES($1,$2,$3)",
          [id_pelicula, id_estudio, financiamiento],
          (err: any, _result: any) => {
            release();
            res.send(err || { id_pelicula, id_estudio, financiamiento });
          }
        );
      };

      fastify.pg.connect(onConnect);
    }
  );

  fastify.put<{ Body: PeliculaEstudioType }>(
    "/",
    {
      schema: {
        body: PeliculaEstudio,
      },
    },
    (req, res) => {
      let { id_pelicula, id_estudio } = req.body;
      let financiamiento = req.body.financiamiento || 0;

      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "UPDATE pelicula_estudio SET(id_pelicula, id_estudio, financiamiento)=($1,$2,$3) WHERE id_pelicula = $1 AND id_estudio = $2",
          [id_pelicula, id_estudio, financiamiento],
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

  fastify.delete<{ Body: PeliculaEstudioType }>(
    "/",
    {
      schema: {
        body: PeliculaEstudio,
      },
    },
    (req, res) => {
      let { id_pelicula, id_estudio } = req.body;
      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "DELETE FROM pelicula_estudio WHERE id_pelicula = $1 AND id_estudio = $2",
          [id_pelicula, id_estudio],
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

export default peliculaEstudioRoute;
