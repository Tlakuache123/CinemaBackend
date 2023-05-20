import { FastifyInstance } from "fastify";
import { PeliculaGuionista, PeliculaGuionistaType } from "./../types/dualTable";
import { Id, IdType } from "../types/idType";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const peliculaGuionistaRoute: FastifyPluginAsyncTypebox = async (
  fastify: FastifyInstance,
  _options: any
) => {
  fastify.get("/", async (_req, _res) => {
    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query("SELECT * FROM pelicula_guionista");
      return rows;
    } catch (err) {
      return { error: err };
    } finally {
      client.release();
    }
  });

  fastify.get(
    "/:pelicula/:persona",
    {
      schema: {
        params: PeliculaGuionista,
      },
    },
    async (req, _res) => {
      const { id_pelicula, id_persona } = req.params as PeliculaGuionistaType;
      const client = await fastify.pg.connect();
      try {
        const { rows } = await client.query(
          "SELECT * FROM pelicula_guionista WHERE id_pelicula = $1 AND id_persona = $2",
          [id_pelicula, id_persona]
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
          "SELECT * FROM pelicula_guionista WHERE id_persona = $1",
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
    "/:id/guionista",
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
          "SELECT * FROM pelicula_guionista WHERE id_persona = $1",
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
FROM pelicula_guionista AS pegu 
JOIN guionista AS gu ON pegu.id_persona = gu.id_persona 
JOIN pelicula AS pe ON pegu.id_pelicula = pe.id_pelicula`
      );
      return rows;
    } catch (err) {
      return { error: err };
    } finally {
      client.release();
    }
  });

  fastify.get(
    "/full/:cancion/:persona",
    {
      schema: {
        params: PeliculaGuionista,
      },
    },
    async (req, _res) => {
      const { id_pelicula, id_persona } = req.params as PeliculaGuionistaType;
      const client = await fastify.pg.connect();
      try {
        const { rows } = await client.query(
          `
SELECT * 
FROM pelicula_guionista AS pegu 
JOIN guionista AS gu ON pegu.id_persona = gu.id_persona 
JOIN pelicula AS pe ON pegu.id_pelicula = pe.id_pelicula
WHERE pegu.id_pelicula = $1 AND pegu.id_persona = $2`,
          [id_pelicula, id_persona]
        );
        return rows;
      } catch (err) {
        return { error: err };
      } finally {
        client.release();
      }
    }
  );

  fastify.post<{ Body: PeliculaGuionistaType; Reply: PeliculaGuionistaType }>(
    "/",
    {
      schema: {
        body: PeliculaGuionista,
        response: {
          200: PeliculaGuionista,
        },
      },
    },
    (req, res) => {
      let { id_pelicula, id_persona } = req.body;
      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "INSERT INTO pelicula_guionista(id_pelicula, id_persona) VALUES($1, $2)",
          [id_pelicula, id_persona],
          (err: any, _result: any) => {
            release();
            res.send(err || { id_pelicula, id_persona });
          }
        );
      };

      fastify.pg.connect(onConnect);
    }
  );

  fastify.delete<{ Body: PeliculaGuionistaType }>(
    "/",
    {
      schema: {
        body: PeliculaGuionista,
      },
    },
    (req, res) => {
      let { id_pelicula, id_persona } = req.body;
      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "DELETE FROM pelicula_guionista WHERE id_pelicula = $1 AND id_persona = $2",
          [id_pelicula, id_persona],
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

export default peliculaGuionistaRoute;
