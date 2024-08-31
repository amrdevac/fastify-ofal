import { FastifyReply, FastifyRequest } from 'fastify';
import dotenv from 'dotenv';

dotenv.config();

export const authMiddleware = (request: FastifyRequest, reply: FastifyReply, done: Function) => {
  const key = request.headers['key'] as string;
  const validKeys = process.env.KEY_EXIST?.split(',');

  if (!key || !validKeys?.includes(key)) {
    reply.status(401).send({
      status: false,
      message: 'Unauthorized',
      data: null,
      errors: null,
    });
    return;
  }
  done();
};
