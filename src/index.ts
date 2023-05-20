import Fastify, { FastifyInstance } from "fastify";
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
import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";

const server: FastifyInstance = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

server.register(dbConnector);
server.register(paisRoute, { prefix: "pais" });
server.register(personaRoute, { prefix: "persona" });
server.register(actorRoute, { prefix: "actor" });
server.register(directorRoute, { prefix: "director" });
server.register(estudioRoute, { prefix: "estudio" });
server.register(guionistaRoute, { prefix: "guionista" });
server.register(peliculaRoute, { prefix: "pelicula" });
server.register(cancionRoute, { prefix: "cancion" });
server.register(soundtrackRoute, { prefix: "soundtrack" });
server.register(personajeRoute, { prefix: "personaje" });
server.register(adaptacionRoute, { prefix: "adaptacion" });
server.register(cancionPersonaRoute, { prefix: "cancionpersona" });

server.get("/", async (_req, rep) => {
  rep.type("text/html");
  return `<h1>Proyecto de base de datos</h1>
    <h2>Aplicacion de Peliculas :)</h2>
      <ul>
        <li>Claudio</li>
        <li>Diego</li>
        <li>Kevin</li>
        <li>Sofia</li>
        <li>La amiga de Sofia xd</li>
      </ul>`;
});

const start = async () => {
  try {
    await server.listen({ port: 3000 });

    const address = server.server.address();
    const port = typeof address === "string" ? address : address?.port;

    console.log(`listening at port ${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};
start();
