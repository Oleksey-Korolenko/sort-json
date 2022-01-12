import { Request, Response, Router } from 'express';
import QueryService from '../query/query.service';
import SortJsonService from './sort-json.service';

export default (router: typeof Router) => {
  const routes = router();

  const sortJsonService = new SortJsonService();

  routes.get('/', (req: Request, res: Response) => {
    return QueryService.sendResponse<string>(200, '', res);
  });

  return routes;
};
