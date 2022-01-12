import { Request, Response, Router } from 'express';
import { sendResponse } from '../common/response';
import ExampleService from './example.service';

export default (router: typeof Router) => {
  const routes = router();

  const exampleService = new ExampleService();

  routes.post('/example', (req: Request, res: Response) => {
    const response = ExampleService.example('');

    return sendResponse(
      200,
      {
        response,
      },
      res
    );
  });

  return routes;
};
