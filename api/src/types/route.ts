import { Request, Response } from 'express';

export type RouteInfo = {
  path: string;
  verb: 'get' | 'post' | 'put' | 'delete';
  handler: (req: Request, res: Response) => void;
};
