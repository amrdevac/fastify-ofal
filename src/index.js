"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
const projectService_1 = require("./services/projectService");
const logMiddleware_1 = require("./middlewares/logMiddleware");
const fastify = (0, fastify_1.default)();
// fastify.addHook("onResponse", successMiddlware);
fastify.addHook("onSend", logMiddleware_1.successMiddlware);
fastify.addHook("preHandler", authMiddleware_1.authMiddleware);
fastify.post("/project/list", projectService_1.listProjects);
fastify.post("/project/add", projectService_1.addProject);
fastify.post("/project/update/:id", projectService_1.updateProject);
fastify.post("/project/delete/:id", projectService_1.deleteProject);
fastify.setErrorHandler(logMiddleware_1.logMiddleware);
fastify.listen({ port: 6000 }, (err, address) => {
    if (err) {
        fastify.log.error(err);
        process.exit(1);
    }
    fastify.log.info(`Server listening at ${address}`);
});
