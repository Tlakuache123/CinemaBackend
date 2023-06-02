import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fastifyPlugin from "fastify-plugin";
import fastifyPostgres from "@fastify/postgres";

const dbConnector: FastifyPluginAsync = async (fastify: FastifyInstance) => {
  fastify.register(fastifyPostgres, {
    connectionString:
      "postgres://postgres:deux_patapon123@localhost:5432/dbPelicula",
  });
};

export default fastifyPlugin(dbConnector);
