import * as dotenv from "dotenv";
dotenv.config();

import Fastify, { FastifyInstance } from "fastify";
import fastify from "fastify";
import cors from "@fastify/cors";
import dbConnector from "./dbconnector";
import paisRoute from "./routes/pais";
import personaRoute from "./routes/persona";
import actorRoute from "./routes/actor";
import directorRoute from "./routes/director";
import estudioRoute from "./routes/estudio";
import guionistaRoute from "./routes/guionista";
import peliculaRoute from "./routes/pelicula";
import cancionRoute from "./routes/cancion";
import soundtrackRoute from "./routes/soundtrack";
import personajeRoute from "./routes/personaje";
import adaptacionRoute from "./routes/adaptacion";
import cancionPersonaRoute from "./routes/cancion_persona";
import peliculaGuionistaRoute from "./routes/pelicula_guionista";
import peliculaGeneroRoute from "./routes/pelicula_genero";
import peliculaEstudioRoute from "./routes/pelicula_estudio";
import peliculaDirectorRoute from "./routes/pelicula_director";
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import path from "path";

declare module "fastify" {
  interface FastifyInstance {
    config: {
      PORT: number;
      DBURL: string;
    };
  }
}

const server: FastifyInstance = fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

const schema = {
  type: "object",
  required: ["PORT", "DBURL"],
  properties: {
    PORT: {
      type: "number",
      default: 5300,
    },
    DBURL: {
      type: "string",
    },
  },
};

const options = {
  dotenv: true,
  schema: schema,
};

const initialize = async () => {
  server.register(require("@fastify/env"), options).ready((err) => {
    if (err) console.error(err);
  });
  await server.after();

  const url = server.config.DBURL;

  server.register(require("@fastify/postgres"), {
    connectionString: url,
  });

  server.register(require("@fastify/static"), {
    root: path.join(__dirname, "../build"),
    prefix: "/",
  });

  server.register(cors, {});

  //server.register(dbConnector);
  server.register(paisRoute, { prefix: "api/pais" });
  server.register(personaRoute, { prefix: "api/persona" });
  server.register(actorRoute, { prefix: "api/actor" });
  server.register(directorRoute, { prefix: "api/director" });
  server.register(estudioRoute, { prefix: "api/estudio" });
  server.register(guionistaRoute, { prefix: "api/guionista" });
  server.register(peliculaRoute, { prefix: "api/pelicula" });
  server.register(cancionRoute, { prefix: "api/cancion" });
  server.register(soundtrackRoute, { prefix: "api/soundtrack" });
  server.register(personajeRoute, { prefix: "api/personaje" });
  server.register(adaptacionRoute, { prefix: "api/adaptacion" });
  server.register(cancionPersonaRoute, { prefix: "api/cancionpersona" });
  server.register(peliculaGuionistaRoute, { prefix: "api/peliculaguionista" });
  server.register(peliculaGeneroRoute, { prefix: "api/peliculagenero" });
  server.register(peliculaEstudioRoute, { prefix: "api/peliculaestudio" });
  server.register(peliculaDirectorRoute, { prefix: "api/peliculadirector" });

  await server.after();
  start();
};

const start = async () => {
  try {
    const p = server.config.PORT;
    await server.listen({ port: p });

    const address = server.server.address();
    const port = typeof address === "string" ? address : address?.port;

    console.log(`listening at port ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

initialize();
