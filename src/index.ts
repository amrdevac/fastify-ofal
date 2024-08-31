import Fastify from "fastify";
import { authMiddleware } from "./middlewares/authMiddleware";
import {
  listProjects,
  addProject,
  updateProject,
  deleteProject,
} from "./services/projectService";
import { logMiddleware, successMiddlware } from "./middlewares/logMiddleware";

const fastify = Fastify();

fastify.addHook("onSend", successMiddlware);
fastify.addHook("preHandler", authMiddleware);

fastify.post("/project/list", listProjects);
fastify.post("/project/add", addProject);
fastify.post("/project/update/:id", updateProject);
fastify.post("/project/delete/:id", deleteProject);

fastify.setErrorHandler(logMiddleware);

fastify.listen({ port: 6000 }, (err, address) => {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  fastify.log.info(`Server listening at ${address}`);
});
