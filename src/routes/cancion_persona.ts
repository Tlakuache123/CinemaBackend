import { FastifyInstance } from "fastify";
import { CancionPersona, CancionPersonaType } from "./../types/dualTable";
import { Id, IdType, LongId, LongIdType } from "../types/idType";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const cancionPersonaRoute: FastifyPluginAsyncTypebox = async (
  fastify: FastifyInstance,
  _options: any
) => {
  fastify.get("/", async (_req, _res) => {
    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query("SELECT * FROM cancion_persona");
      return rows;
    } catch (err) {
      return { error: err };
    } finally {
      client.release();
    }
  });

  fastify.get(
    "/:cancion/:persona",
    {
      schema: {
        params: CancionPersona,
      },
    },
    async (req, _res) => {
      const { nombre, artista } = req.params as CancionPersonaType;
      const client = await fastify.pg.connect();
      try {
        const { rows } = await client.query(
          "SELECT * FROM cancion WHERE nombre = $1 AND artista = $2",
          [nombre, artista]
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
        params: LongId,
      },
    },
    async (req, _res) => {
      const { id } = req.params as LongIdType;
      const client = await fastify.pg.connect();
      try {
        const { rows } = await client.query(
          "SELECT * FROM cancion_persona WHERE nombre = $1",
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
    "/:id/persona",
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
          "SELECT * FROM cancion_persona WHERE artista = $1",
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
FROM cancion_persona AS cape 
JOIN persona AS pe ON cape.persona = pe.id_persona 
JOIN cancion AS ca ON cape.nombre = ca.nombre`
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
        params: CancionPersona,
      },
    },
    async (req, _res) => {
      const { nombre, artista } = req.params as CancionPersonaType;
      const client = await fastify.pg.connect();
      try {
        const { rows } = await client.query(
          `
SELECT * 
FROM cancion_persona AS cape 
JOIN persona AS pe ON cape.persona = pe.id_persona 
JOIN cancion AS ca ON cape.nombre = ca.nombre
WHERE cape.nombre = $1 AND cape.artista = $2`,
          [nombre, artista]
        );
        return rows;
      } catch (err) {
        return { error: err };
      } finally {
        client.release();
      }
    }
  );

  fastify.post<{ Body: CancionPersonaType; Reply: CancionPersonaType }>(
    "/",
    {
      schema: {
        body: CancionPersona,
        response: {
          200: CancionPersona,
        },
      },
    },
    (req, res) => {
      let { nombre, artista } = req.body;
      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "INSERT INTO cancion_persona(nombre, artista) VALUES($1, $2)",
          [nombre, artista],
          (err: any, _result: any) => {
            release();
            res.send(err || { nombre, artista });
          }
        );
      };

      fastify.pg.connect(onConnect);
    }
  );

  fastify.delete<{ Body: CancionPersonaType }>(
    "/",
    {
      schema: {
        body: CancionPersona,
      },
    },
    (req, res) => {
      let { nombre, artista } = req.body;
      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "DELETE FROM cancion_persona WHERE nombre = $1 AND artista = $2",
          [nombre, artista],
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

export default cancionPersonaRoute;
