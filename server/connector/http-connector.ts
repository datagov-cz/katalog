/**
 * We use custom response class to allow for easy testing.
 */
export interface HttpResponse {

  /**
   * HTTP status code.
   */
  status: number;

  json: () => Promise<any>;
}

export interface HttpConnector {

  /**
   * Fetch and return content from given URL.
   * @param url
   */
  fetch(url: string): Promise<HttpResponse>;
}

class DefaultHttpConnector implements HttpConnector {
  fetch(url: string): Promise<HttpResponse> {
    return fetch(url);
  }
}

export function createDefaultHttpConnector() {
  return new DefaultHttpConnector();
}

export function hasRequestFailed(response: HttpResponse): boolean {
  return response.status > 299;
}

/**
 * Use this error to report failed HTTP request.
 */
export class HttpFailed extends Error {
  constructor(response: HttpResponse, message: string) {
    super(`HTTP request failed with status ${response.status}: ${message}`);
  }
}
