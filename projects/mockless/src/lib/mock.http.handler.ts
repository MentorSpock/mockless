import {
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpResponse,
  HttpBackend,
  HttpHeaders,
  HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Record } from './record.entity';
import { getMockStorage } from './mock.storage';


@Injectable()
export class HistoryRecorderHandler implements HttpHandler {
  private mockStore = getMockStorage();
  constructor(readonly httpClient: HttpBackend) {
  }

  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    return this.mock(req) || this.recordAndHandle(req);
  }

  mock(req: HttpRequest<any>): Observable<HttpEvent<any>> | null {
    const mockable = this.mockStore.fetchMockable(req);
    if(!mockable){
      return null;
    }
    
    return new Observable<HttpEvent<any>>(observer => {
      if (mockable.isError) {
        // Replay the error
        const response = {
          ...mockable.response,
          status: mockable.status,
          statusText: mockable.statusText || 'Error',
          url: mockable.url,
        }
        observer.error(response);
      } else {
        // Replay the successful response
        observer.next(new HttpResponse({
          body: mockable.response,
          status: mockable.status,
          headers: new HttpHeaders(mockable.headers),
          statusText: 'OK'
        }));
        observer.complete();
      }
    });
  }

  recordAndHandle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    const cloned = req.clone();
    const entry: Partial<Record> = {
      method: cloned.method,
      url: cloned.urlWithParams,
      headers: this.headersToObject(cloned.headers),
      body: cloned.body,
      timestamp: Date.now()
    };

    return this.httpClient.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          entry.response = event.body;
          entry.status = event.status;
          entry.isError = false;
          this.mockStore.pushToHistory(entry as Record);
        }
      }),
      catchError(error => {
        // Record the error
        entry.isError = true;
        const response = JSON.parse(JSON.stringify(error));
        entry.response = {
          headers: response.headers,
          name: response.name,
          message: response.message,
          error: response.error,
          ok: response.ok,
        }
        entry.status = response.status;
        entry.statusText = response.statusText;
        this.mockStore.pushToHistory(entry as Record);
        
        // Re-throw the error to maintain the original error flow
        return throwError(() => error);
      })
    );
  }

  private headersToObject(headers: HttpHeaders): { [key: string]: string } {
    const result: { [key: string]: string } = {};
    headers.keys().forEach(key => {
      result[key] = headers.get(key) || '';
    });
    return result;
  }
}


let handlerInstance: HistoryRecorderHandler | null = null;

export function mockHttpHandlerFactory(httpClient: HttpBackend): HttpHandler {
  if (!handlerInstance) {
    handlerInstance = new HistoryRecorderHandler(httpClient);
  }
  return handlerInstance;
}
