import { Request, Response, Router } from 'express';
import { asyncHandler } from '../middlewares';
import { IResponse } from '../query';
import QueryService from '../query/query.service';
import SortJsonService from './sort-json.service';

export default (router: typeof Router) => {
  const routes = router();

  const sortJsonService = new SortJsonService();

  routes.get(
    '/',
    asyncHandler(async (req: Request, res: Response) => {
      const response = await sortJsonService.sortJson();

      return QueryService.sendResponse<IResponse<string>>(200, response, res);
    })
  );

  return routes;
};
