import { FastifyReply, FastifyRequest } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

async function getAuthorById(args: {
  req: FastifyRequest<{
    Params?: { id?: string };
  }, Server, IncomingMessage>; rep: FastifyReply<Server, IncomingMessage, ServerResponse, {
    Params?: { id?: string };
  }, unknown>;
}) {
  const { rep, req } = args;

  try {
    const author = await req.server.prisma.author.findUnique({
      where: {
        id: parseInt(req.params.id),
      },
      include: {
        books: true,
        wikipedia: true
      }
    });

    rep.code(200).send({ author });
  } catch (err) {
    rep.code(400).send({ err });
  }
}

export {
  getAuthorById
};
