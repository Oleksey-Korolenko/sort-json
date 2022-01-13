import { isArray, isObject } from 'lodash';
import { IQueryAttributes, IQueryHeaders, IResponse } from '../query';
import EQueryCode from '../query/enum/query.enum';
import QueryService from '../query/query.service';
import LIST_OF_LINK from './constant';
import { IJsonObject } from './interface';

export default class sortJsonService {
  private _listOfLink;
  private _QueryService;
  private _baseUrl;
  private _baseHeaders;
  private _baseAttributes;

  constructor() {
    this._listOfLink = LIST_OF_LINK;
    this._QueryService = QueryService;
    this._baseUrl = process.env.BASE_URL;
    this._baseHeaders = {
      'Content-Type': 'application/json',
    } as IQueryHeaders;
    this._baseAttributes = {
      hostname: this._baseUrl ?? '',
      path: '',
      method: 'GET',
      headers: {
        ...this._baseHeaders,
      },
    } as IQueryAttributes<IQueryHeaders>;
  }

  public sortJson = async (): Promise<IResponse<string>> => {
    let countTrue = 0;
    let countFalse = 0;

    for (const link of this._listOfLink) {
      const response = await this.getJson(link);

      if (response === undefined) {
        continue;
      }

      const isDone = this.findIsDoneInJson(response);

      switch (isDone) {
        case true: {
          countTrue += 1;
          break;
        }
        case false: {
          countFalse += 1;
          break;
        }
        case undefined: {
          console.warn(`Can't find isDone in response for link: [${link}]`);
          break;
        }
      }
    }

    return {
      message: 'Everithing is correct!',
      data: `Значений True: ${countTrue}. Значений False: ${countFalse}`,
    };
  };

  private getJson = async (
    link: string,
    tryNumber = 1
  ): Promise<IJsonObject | undefined> => {
    if (tryNumber === 4) {
      console.warn(`Can't get response for link: [${link}]`);
      return undefined;
    }
    const response = await this._QueryService.sendRequest<
      IQueryHeaders,
      IJsonObject,
      {}
    >(
      {
        ...this._baseAttributes,
        path: link,
      },
      {},
      {}
    );
    if (response.code === EQueryCode.BAD_REQUEST) {
      return await this.getJson(link, tryNumber + 1);
    } else {
      return response.data;
    }
  };

  private findIsDoneInJson = (object: IJsonObject): boolean | undefined => {
    for (const key in object) {
      const element = object[key];
      if (key === 'isDone') {
        return element as unknown as boolean;
      }

      let isDone: boolean | undefined;

      if (isArray(object[key])) {
        isDone = this.findIsDoneInArray(object[key]);
      } else if (isObject(object[key])) {
        isDone = this.findIsDoneInJson(object[key]);
      }

      if (isDone !== undefined) {
        return isDone;
      }
    }
    return undefined;
  };

  private findIsDoneInArray = (array: any[]): boolean | undefined => {
    for (const item of array) {
      let isDone: boolean | undefined;

      if (isArray(item)) {
        isDone = this.findIsDoneInArray(item);
      } else if (isObject(item)) {
        isDone = this.findIsDoneInJson(item);
      }

      if (isDone !== undefined) {
        return isDone;
      }
    }
    return undefined;
  };
}
