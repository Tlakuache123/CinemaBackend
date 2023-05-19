import { FastifyInstance } from "fastify";
import { PeliculaType, Pelicula } from "./../types/peliculaType";
import { IdType, Id } from "./../types/idType";
import { FastifyPluginAsyncTypebox } from "@fastify/type-provider-typebox";
import { nanoid } from "nanoid";

const peliculaRoute: FastifyPluginAsyncTypebox = async (
  fastify: FastifyInstance,
  _options: any
) => {
  fastify.get("/", async (_req, _res) => {
    const client = await fastify.pg.connect();
    try {
      const { rows } = await client.query("SELECT * FROM pelicula");
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
          "SELECT * FROM pelicula WHERE id_pelicula = $1",
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
        "SELECT * FROM pelicula pel JOIN pais pa ON pel.id_pais = pa.id_pais"
      );
      return rows;
    } catch (err) {
      return { error: err };
    } finally {
      client.release();
    }
  });

  fastify.get(
    "/full/:id",
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
          "SELECT * FROM pelicula pel JOIN pais pa ON pel.id_pais = pa.id_pais WHERE pel.id_pelicula = $1",
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

  fastify.post<{ Body: PeliculaType; Reply: PeliculaType }>(
    "/",
    {
      schema: {
        body: Pelicula,
        response: {
          200: Pelicula,
        },
      },
    },
    (req, res) => {
      let {
        nombre,
        tipo_guion,
        anio,
        id_pais,
        sipnosis,
        fecha_estreno,
        duracion,
        clasificacion,
        idioma,
      } = req.body;
      const id: string = nanoid();

      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          `INSERT INTO pelicula(
            id_pelicula,
            nombre,
            tipo_guion,
            anio,
            id_pais,
            sipnosis,
            fecha_estreno,
            duracion,
            clasificacion,
            idioma
          )
          VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
          [
            id,
            nombre,
            tipo_guion,
            anio,
            id_pais,
            sipnosis,
            fecha_estreno,
            duracion,
            clasificacion,
            idioma,
          ],
          (err: any, _result: any) => {
            release();
            res.send(
              err || {
                id,
                nombre,
                tipo_guion,
                anio,
                id_pais,
                sipnosis,
                fecha_estreno,
                duracion,
                clasificacion,
                idioma,
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
          "DELETE FROM pelicula WHERE id_pelicula = $1",
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

  fastify.put<{ Body: PeliculaType; Reply: PeliculaType }>(
    "/",
    {
      schema: {
        body: Pelicula,
      },
    },
    (req, res) => {
      let {
        id,
        nombre,
        tipo_guion,
        anio,
        id_pais,
        sipnosis,
        fecha_estreno,
        duracion,
        clasificacion,
        idioma,
      } = req.body;
      const onConnect = (err: any, client: any, release: any) => {
        if (err) return res.send(err);

        client.query(
          `UPDATE pelicula SET (
            nombre,
            tipo_guion,
            anio,
            id_pais,
            sipnosis,
            fecha_estreno,
            duracion,
            clasificacion,
            idioma
          ) = ($2, $3, $4, $5, $6, $7, $8, $9, $10)
 WHERE id_pelicula = $1`,
          [
            id,
            nombre,
            tipo_guion,
            anio,
            id_pais,
            sipnosis,
            fecha_estreno,
            duracion,
            clasificacion,
            idioma,
          ],
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

export default peliculaRoute;
