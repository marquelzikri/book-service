import { getBooksID } from '../../controllers/book';
import { NowRequestHandler } from 'fastify-now';

export const GET: NowRequestHandler<{ Querystring: { authorIDs: string, years: string, page: string, pageSize: string } }> = async (req, rep) => {
  getBooksID({req, rep});
};
