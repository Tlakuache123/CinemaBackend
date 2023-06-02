import { FastifyInstance } from "fastify";
import {
  PersonajeType,
  Personaje,
  PersonajeIdType,
  PersonajeId,
} from "./../types/personajeType";
import { IdType, LongIdType } from "./../types/idType";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const personajeRoute: FastifyPluginAsyncTypebox = async (
  fastify: FastifyInstance,
  _options: any
) => {
  fastify.get("/", async (_req, _res) => {
    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query("SELECT * FROM personaje");
      return rows;
    } catch (err) {
      return { error: err };
    } finally {
      client.release();
    }
  });

  fastify.get(
    "/:personaje_id/:id_pelicula",
    {
      schema: {
        params: PersonajeId,
      },
    },
    async (req, _res) => {
      const { id_pelicula, personaje } = req.params as PersonajeIdType;
      const client = await fastify.pg.connect();
      try {
        const { rows } = await client.query(
          "SELECT * FROM personaje WHERE personaje = $1",
          [personaje, id_pelicula]
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
        params: {
          type: "object",
          properties: {
            id: { type: "string" },
          },
        },
      },
    },
    async (req, _res) => {
      const { id } = req.params as LongIdType;
      const client = await fastify.pg.connect();
      try {
        const { rows } = await client.query(
          `SELECT * FROM obtener_personajes_por_actor($1)`,
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
          "SELECT * FROM personaje WHERE id_pelicula = $1",
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

  fastify.post<{ Body: PersonajeType; Reply: PersonajeType }>(
    "/",
    {
      schema: {
        body: Personaje,
        response: {
          200: Personaje,
        },
      },
    },
    (req, res) => {
      let { personaje, id_pelicula, tipo_personaje, descripcion, id_persona } =
        req.body;

      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          `INSERT INTO personaje(
            personaje,
            id_pelicula,
            tipo_personaje,
            descripcion,
            id_persona
          )
          VALUES($1, $2, $3, $4, $5)`,
          [personaje, id_pelicula, tipo_personaje, descripcion, id_persona],
          (err: any, _result: any) => {
            release();
            res.send(
              err || {
                personaje,
                id_pelicula,
                tipo_personaje,
                descripcion,
                id_persona,
              }
            );
          }
        );
      };

      fastify.pg.connect(onConnect);
    }
  );

  fastify.delete<{ Body: PersonajeIdType }>(
    "/",
    {
      schema: {
        body: PersonajeId,
      },
    },
    (req, res) => {
      let { id_pelicula, personaje } = req.body;
      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "DELETE FROM personaje WHERE id_pelicula = $1 AND personaje = $2",
          [id_pelicula, personaje],
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

  fastify.put<{ Body: PersonajeType; Reply: PersonajeType }>(
    "/",
    {
      schema: {
        body: Personaje,
      },
    },
    (req, res) => {
      let { id_pelicula, personaje, tipo_personaje, descripcion, id_persona } =
        req.body;
      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          `UPDATE personaje SET (
            id_pelicula,
            personaje,
            tipo_personaje,
            descripcion,
            id_persona
          ) = ($1,$2,$3,$4,$5)
 WHERE id_pelicula = $1 AND personaje = $2`,
          [id_pelicula, personaje, tipo_personaje, descripcion, id_persona],
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

export default personajeRoute;
