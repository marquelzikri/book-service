import getPagination from '@lib/pagination';
import { FastifyReply, FastifyRequest } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';

async function getBooksId(args: {
  req: FastifyRequest<{
    Querystring?: {
      authorIDs?: string;
      years?: string;
      page?: string;
      pageSize?: string;
      minimum?: string;
      maximum?: string;
      interval?: string,
    };
    Params?: { id?: string };
  }, Server, IncomingMessage>; rep: FastifyReply<Server, IncomingMessage, ServerResponse, {
    Querystring?: {
      authorIDs?: string;
      years?: string;
      page?: string;
      pageSize?: string;
      minimum?: string;
      maximum?: string;
      interval?: string,
    };
    Params?: { id?: string };
  }, unknown>;
}) {
  const { rep, req } = args;

  const authors = req.query.authorIDs ?
    req.query.authorIDs.includes(',') ?
      req.query.authorIDs.split(',').map(id => parseInt(id)) :
      parseInt(req.query.authorIDs) :
    null;

  const years = req.query.years ?
    req.query.years.includes(',') ?
      req.query.years.split(',').map(id => parseInt(id)) :
      parseInt(req.query.years) :
    null;

  const bookId = req.params.id ? parseInt(req.params.id) : null;

  // filter by number of pages
  let minimumPage = req.query.minimum ? parseInt(req.query.minimum) : null;
  let maximumPage = req.query.maximum ? parseInt(req.query.maximum) : null;
  let pageQuery: {gt?: number, gte?: number, lt?: number, lte?: number} = { gte: minimumPage, lte: maximumPage };

  if (req.query.interval) {
    [minimumPage, maximumPage] = req.query.interval.substr(1, req.query.interval.length - 2).split(',').map(i => parseInt(i));
    if (req.query.interval[0] === '[') pageQuery = { gt: minimumPage, lt: maximumPage };
  }

  try {
    if (bookId) {
      const book = await req.server.prisma.book.findUnique({
        where: {
          id: bookId,
        },
      });

      rep.code(200).send({ book });
    } else {
      const books = await req.server.prisma.book.findMany({
        where: {
          ...(authors ? { authors: { every: { id: { in: authors } } } } : {}),
          ...(years ? { year: { in: years } } : {}),
          ...(minimumPage && maximumPage ? { pages: pageQuery } : {})
        },
        orderBy: {
          id: 'asc',
        },
        select: {
          id: true,
          pages: true,
        },
        ...getPagination(req.query.page, req.query.pageSize),
      });

      rep.code(200).send({ books });
    }
  } catch (err) {
    rep.code(400).send({ err });
  }
}

export {
  getBooksId as getBooksID
};
