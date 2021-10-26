import { getBooksID } from '../../../controllers/book';
import { NowRequestHandler } from 'fastify-now';

export const GET: NowRequestHandler<{ Querystring: { minimum: string, maximum: string, interval: string, page: string, pageSize: string } }> = async (req, rep) => {
  getBooksID({ req, rep });
};
