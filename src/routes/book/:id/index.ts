import { getBooksID } from '../../../controllers/book';
import { NowRequestHandler } from 'fastify-now';

export const GET: NowRequestHandler<{ Params: { id: string } }> = async (req, rep) => {
  getBooksID({req, rep});
};
