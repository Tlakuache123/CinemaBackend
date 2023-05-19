import { FastifyInstance } from "fastify";
import { Adaptacion, AdaptacionType } from "./../types/adaptacionType";
import { IdType, Id } from "./../types/idType";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { nanoid } from "nanoid";

const adaptacionRoute: FastifyPluginAsyncTypebox = async (
  fastify: FastifyInstance,
  _options: any
) => {
  fastify.get("/", async (_req, _res) => {
    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query("SELECT * FROM adaptacion");
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
          "SELECT * FROM adaptacion WHERE id_adaptacion = $1",
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

  fastify.post<{ Body: AdaptacionType; Reply: AdaptacionType }>(
    "/",
    {
      schema: {
        body: Adaptacion,
        response: {
          200: Adaptacion,
        },
      },
    },
    (req, res) => {
      let { id_pelicula, idioma, nombre_adaptado, doblaje } = req.body;
      const id = nanoid();
      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "INSERT INTO adaptacion(id_adaptacion, id_pelicula, idioma, nombre_adaptado, doblaje) VALUES($1,$2,$3,$4,$5)",
          [id, id_pelicula, idioma, nombre_adaptado, doblaje],
          (err: any, _result: any) => {
            release();
            res.send(err || {id, id_pelicula, idioma, nombre_adaptado, doblaje });
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
          "DELETE FROM adaptacion WHERE id_adaptacion = $1",
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

  fastify.put<{ Body: AdaptacionType; Reply: AdaptacionType }>(
    "/",
    {
      schema: {
        body: Adaptacion,
      },
    },
    (req, res) => {
      let { id, id_pelicula, idioma, nombre_adaptado, doblaje } = req.body;

      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "UPDATE adaptacion SET (id_pelicula, idioma, nombre_adaptado, doblaje) = ($2,$3,$4,$5) WHERE id_adaptacion = $1",
          [id, id_pelicula, idioma, nombre_adaptado, doblaje],
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

export default adaptacionRoute;
