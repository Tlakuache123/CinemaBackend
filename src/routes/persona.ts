import { FastifyInstance } from "fastify";
import { Persona, PersonaType } from "./../types/personaType";
import { IdType, Id } from "./../types/idType";
import { nanoid } from "nanoid";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const personaRoute: FastifyPluginAsyncTypebox = async (
  fastify: FastifyInstance,
  _options: any
) => {
  fastify.get("/", async (_req, _res) => {
    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query("SELECT * FROM persona");
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
          "SELECT * FROM persona WHERE id_persona = $1",
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

  fastify.post<{ Body: PersonaType; Reply: PersonaType }>(
    "/",
    {
      schema: {
        body: Persona,
        response: {
          200: Persona,
        },
      },
    },
    (req, res) => {
      // Dando formato a persona
      let { nombre, apellido_m, apellido_p, nacionalidad, genero } = req.body;
      nombre = nombre.toLowerCase();
      apellido_p = apellido_p.toLowerCase();
      apellido_m = apellido_m.toLowerCase();
      nacionalidad = nacionalidad.toLowerCase();
      genero = genero.toLowerCase();

      const id: string = nanoid();
      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "INSERT INTO persona(id_persona, nombre, apellido_p, apellido_m, nacionalidad, genero) VALUES($1,$2,$3,$4,$5,$6)",
          [id, nombre, apellido_p, apellido_m, nacionalidad, genero],
          (err: any, _result: any) => {
            release();
            res.send(
              err || {
                id,
                nombre,
                apellido_p,
                apellido_m,
                nacionalidad,
                genero,
              }
            );
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
          "DELETE FROM persona WHERE id_persona = $1",
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
  fastify.put<{ Body: PersonaType; Reply: PersonaType }>(
    "/",
    {
      schema: {
        body: Persona,
      },
    },
    (req, res) => {
      let { id, nombre, apellido_m, apellido_p, nacionalidad, genero } =
        req.body;
      nombre = nombre.toLowerCase();
      apellido_p = apellido_p.toLowerCase();
      apellido_m = apellido_m.toLowerCase();
      nacionalidad = nacionalidad.toLowerCase();
      genero = genero.toLowerCase();

      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "UPDATE persona SET nombre = $2, apellido_p = $3, apellido_m = $4, nacionalidad = $5, genero = $6 WHERE id_persona = $1",
          [id, nombre, apellido_p, apellido_m, nacionalidad, genero],
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

export default personaRoute;
