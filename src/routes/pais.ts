import { FastifyInstance } from "fastify";
import { PaisType, Pais } from "./../types/paisType";
import { IdType, Id } from "./../types/idType";
import { nanoid } from "nanoid";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";

const paisRoute: FastifyPluginAsyncTypebox = async (
  fastify: FastifyInstance,
  options: any
) => {
  fastify.get("/", async (req, res) => {
    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query("SELECT * FROM pais");
      return rows;
    } catch (err) {
      return { error: err };
    } finally {
      client.release();
    }
  });

  fastify.post<{ Body: PaisType; Reply: PaisType }>(
    "/",
    {
      schema: {
        body: Pais,
        response: {
          200: Pais,
        },
      },
    },
    (req, res) => {
      let { nombre } = req.body;
      nombre = nombre.toLowerCase();
      const id: string = nanoid();
      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "INSERT INTO pais(id_pais, nombre_pais) VALUES($1, $2)",
          [id, nombre],
          (err: any, _result: any) => {
            release();
            res.send(err || { id, nombre });
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
          "DELETE FROM pais WHERE id_pais = $1",
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

  fastify.put<{ Body: PaisType; Reply: PaisType }>(
    "/",
    {
      schema: {
        body: Id,
      },
    },
    (req, res) => {
      let { nombre, id } = req.body;
      nombre = nombre.toLowerCase();

      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          "UPDATE pais SET nombre_pais = $1 WHERE id_pais = $2",
          [nombre, id],
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

export default paisRoute;
