/**
 * This Class is a very minimal wrapper around fetch
 * to make API calls easy.
 */
import fetch from 'isomorphic-unfetch';

export class HttpService<V = any> {
  public static baseUrl = '/api/v1'; // TODO: eed to create some ENV for this
  public static baseHeaders = {
    'Content-Type': 'application/json',
  };

  public stringifyParams(params: Object) {
    return Object.keys(params).reduce((acc, key, i) => {
      return params.hasOwnProperty(key)
        ? `${acc}${i !== 0 ? '&' : '?'}${key}=${params[key]}`
        : acc;
    }, '');
  }

  public async get(
    url: string,
    params: Record<string, string>,
    headers: Record<string, string>,
  ) {
    return fetch(HttpService.baseUrl + url + this.stringifyParams(params), {
      headers: { ...HttpService.baseHeaders, ...headers },
      method: 'GET',
    }).then<V>(res => res.json());
  }
}
