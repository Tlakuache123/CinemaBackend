import { FastifyInstance } from "fastify";
import {
  PeliculaGenero,
  PeliculaGeneroType,
  PeliculaGuionista,
  PeliculaGuionistaType,
} from "./../types/dualTable";
import { Id, IdType, LongId, LongIdType } from "../types/idType";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const peliculaGeneroRoute: FastifyPluginAsyncTypebox = async (
  fastify: FastifyInstance,
  _options: any
) => {
  fastify.get("/", async (_req, _res) => {
    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query("SELECT * FROM pelicula_genero");
      return rows;
    } catch (err) {
      return { error: err };
    } finally {
      client.release();
    }
  });

  fastify.get(
    "/:pelicula/:genero",
    {
      schema: {
        params: PeliculaGenero,
      },
    },
    async (req, _res) => {
      const { id_pelicula, genero } = req.params as PeliculaGeneroType;
      const client = await fastify.pg.connect();
      try {
        const { rows } = await client.query(
          "SELECT * FROM pelicula_genero WHERE id_pelicula = $1 AND genero = $2",
          [id_pelicula, genero]
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
          "SELECT * FROM pelicula_genero WHERE id_pelicula = $1",
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
    "/:id/genero",
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
          "SELECT * FROM pelicula_genero WHERE genero = $1",
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
FROM pelicula_genero AS pege 
JOIN pelicula AS pe ON pege.id_pelicula = pe.id_pelicula`
      );
      return rows;
    } catch (err) {
      return { error: err };
    } finally {
      client.release();
    }
  });

  fastify.get(
    "/full/:pelicula/:genero",
    {
      schema: {
        params: PeliculaGenero,
      },
    },
    async (req, _res) => {
      const { id_pelicula, id_persona } = req.params as PeliculaGuionistaType;
      const client = await fastify.pg.connect();
      try {
        const { rows } = await client.query(
          `
SELECT * 
FROM pelicula_genero AS pege 
JOIN pelicula AS pe ON pege.id_pelicula = pe.id_pelicula
WHERE pege.id_pelicula = $1, pege.genero = $2`,
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

  fastify.post<{ Body: PeliculaGeneroType; Reply: PeliculaGeneroType }>(
    "/",
    {
      schema: {
        body: PeliculaGenero,
        response: {
          200: PeliculaGenero,
        },
      },
    },
    (req, res) => {
      let { id_pelicula, genero } = req.body;
      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "INSERT INTO pelicula_genero(id_pelicula, genero) VALUES($1, $2)",
          [id_pelicula, genero],
          (err: any, _result: any) => {
            release();
            res.send(err || { id_pelicula, genero });
          }
        );
      };

      fastify.pg.connect(onConnect);
    }
  );

  fastify.delete<{ Body: PeliculaGeneroType }>(
    "/",
    {
      schema: {
        body: PeliculaGenero,
      },
    },
    (req, res) => {
      let { id_pelicula, genero } = req.body;
      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "DELETE FROM pelicula_genero WHERE id_pelicula = $1 AND genero = $2",
          [id_pelicula, genero],
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

export default peliculaGeneroRoute;
