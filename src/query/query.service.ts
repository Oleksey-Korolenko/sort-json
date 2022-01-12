import { Response } from 'express';
import { request, RequestOptions } from 'https';
import { IQueryAttributes, IQueryParams, IQueryResponse } from '.';
import EQueryCode from './enum/query.enum';
import HttpStatus from 'http-status-codes';

export default class QueryService {
  static sendRequest = <Headers, ResponseType, BodyType>(
    attributes: IQueryAttributes<Headers>,
    params: IQueryParams,
    body?: BodyType
  ): Promise<IQueryResponse<ResponseType, EQueryCode>> => {
    let preparedParams = '';

    for (const key in params) {
      if (!params[key]) {
        continue;
      }

      preparedParams += `${key}=${params[key]}&`;
    }

    return new Promise<IQueryResponse<ResponseType, EQueryCode>>(
      (resolve, reject) => {
        const req = request(
          {
            ...attributes,
            path: `${attributes.path}?${preparedParams}`,
          } as unknown as RequestOptions,
          (res) => {
            let responseBody = '';
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
              responseBody += chunk;
            });
            res.on('end', () => {
              resolve({
                code: EQueryCode.OK,
                message: 'Everything is correct!',
                data: JSON.parse(responseBody),
              } as IQueryResponse<ResponseType, EQueryCode>);
            });
          }
        );

        if (body !== undefined) {
          req.write(JSON.stringify(body));
        }

        req.on('error', (e) => {
          reject({
            code: EQueryCode.BAD_REQUEST,
            message: e.message ?? 'Bad request!',
          } as IQueryResponse<ResponseType, EQueryCode>);
        });

        req.end();
      }
    );
  };

  static sendResponse = <ResponseType>(
    status: number,
    values: ResponseType,
    res: Response
  ) => {
    res.status(status);
    return res.send({
      status,
      data: values,
    });
  };

  static errorResponse = (_err: unknown, res: Response) => {
    let status = HttpStatus.BAD_REQUEST;
    let message = `Something went wrong!`;
    if (_err instanceof Error) {
      message = _err.message;
    }
    if (_err instanceof TypeError) {
      message = _err.message;
      status = HttpStatus.FORBIDDEN;
    }
    return this.sendResponse<{
      message: string;
    }>(status, { message }, res);
  };
}
