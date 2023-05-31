import { FastifyInstance } from "fastify";
import { PeliculaDirector, PeliculaDirectorType } from "./../types/dualTable";
import { Id, IdType, LongId, LongIdType } from "../types/idType";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const peliculaDirectorRoute: FastifyPluginAsyncTypebox = async (
  fastify: FastifyInstance,
  _options: any
) => {
  fastify.get("/", async (_req, _res) => {
    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query("SELECT * FROM pelicula_director");
      return rows;
    } catch (err) {
      return { error: err };
    } finally {
      client.release();
    }
  });

  fastify.get(
    "/:id_pelicula/:id_persona",
    {
      schema: {
        params: PeliculaDirector,
      },
    },
    async (req, _res) => {
      const { id_pelicula, id_persona } = req.params as PeliculaDirectorType;
      const client = await fastify.pg.connect();
      try {
        const { rows } = await client.query(
          "SELECT * FROM pelicula_director WHERE id_pelicula = $1 AND id_persona = $2",
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
          "SELECT * FROM pelicula_director WHERE id_director = $1",
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
    "/:id/director",
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
          FROM pelicula_director pedir
          JOIN pelicula pe ON pedir.id_pelicula = pe.id_pelicula
          WHERE pedir.id_persona = $1`,
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
FROM pelicula_director AS pedi
JOIN pelicula AS pe ON pedi.id_pelicula = pe.id_pelicula
JOIN director AS di ON pedi.id_persona = di.id_persona`
      );
      return rows;
    } catch (err) {
      return { error: err };
    } finally {
      client.release();
    }
  });

  fastify.get(
    "/full/:id_pelicula/:id_persona",
    {
      schema: {
        params: PeliculaDirector,
      },
    },
    async (req, _res) => {
      const { id_pelicula, id_persona } = req.params as PeliculaDirectorType;
      const client = await fastify.pg.connect();
      try {
        const { rows } = await client.query(
          `
SELECT * 
FROM pelicula_director AS pedi
JOIN pelicula AS pe ON pedi.id_pelicula = pe.id_pelicula
JOIN director AS di ON pedi.id_persona = di.id_persona
WHERE pees.id_pelicula = $1 AND pees.id_persona = $2`,
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

  fastify.post<{ Body: PeliculaDirectorType; Reply: PeliculaDirectorType }>(
    "/",
    {
      schema: {
        body: PeliculaDirector,
        response: {
          200: PeliculaDirector,
        },
      },
    },
    (req, res) => {
      let { id_pelicula, id_persona } = req.body;
      let tipo_direccion = req.body.tipo_direccion || "estrella";
      let salario = req.body.salario || 0;

      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "INSERT INTO pelicula_director(id_pelicula, id_persona, tipo_direccion, salario) VALUES($1,$2,$3,$4)",
          [id_pelicula, id_persona, tipo_direccion, salario],
          (err: any, _result: any) => {
            release();
            res.send(
              err || { id_pelicula, id_persona, tipo_direccion, salario }
            );
          }
        );
      };

      fastify.pg.connect(onConnect);
    }
  );

  fastify.put<{ Body: PeliculaDirectorType }>(
    "/",
    {
      schema: {
        body: PeliculaDirector,
      },
    },
    (req, res) => {
      let { id_pelicula, id_persona } = req.body;
      let tipo_direccion = req.body.tipo_direccion || "estrella";
      let salario = req.body.salario || 0;

      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "UPDATE pelicula_director SET(id_pelicula, id_persona, tipo_direccion, salario)=($1,$2,$3,$4) WHERE id_pelicula=$1 AND id_persona=$2",
          [id_pelicula, id_persona, tipo_direccion, salario],
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

  fastify.delete<{ Body: PeliculaDirectorType }>(
    "/",
    {
      schema: {
        body: PeliculaDirector,
      },
    },
    (req, res) => {
      let { id_pelicula, id_persona } = req.body;
      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "DELETE FROM pelicula_director WHERE id_pelicula = $1 AND id_persona = $2",
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

export default peliculaDirectorRoute;
