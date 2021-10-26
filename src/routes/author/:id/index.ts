import { getAuthorById } from '../../../controllers/author';
import { NowRequestHandler } from 'fastify-now';

export const GET: NowRequestHandler<{ Params: { id: string } }> = async (req, rep) => {
  getAuthorById({req, rep});
};
