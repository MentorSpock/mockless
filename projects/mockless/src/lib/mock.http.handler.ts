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

export interface RecordedEntry {
  method: string;
  url: string;
  headers: { [key: string]: string };
  body: any;
  response: any;
  status: number;
  timestamp: number;
  isError?: boolean;
  errorMessage?: string;
}

@Injectable()
export class HistoryRecorderHandler implements HttpHandler {
  private history: RecordedEntry[] = [];
  private mockables: RecordedEntry[] = [];
  constructor(readonly httpClient: HttpBackend) {
  }

  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    if(localStorage.getItem('mockless.enable') !== 'true') {
      return this.httpClient.handle(req);
    }
    return this.mock(req) || this.recordAndHandle(req);
  }

  fetchMockable(req: HttpRequest<any>): RecordedEntry | null {
    return this.mockables.find(entry => 
      entry.method === req.method && 
      entry.url === req.urlWithParams) || null;
  }

  storeMockable(entry: RecordedEntry) {
    this.history.push(entry);
  }

  mock(req: HttpRequest<any>): Observable<HttpEvent<any>> | null {
    const mockable = this.fetchMockable(req);
    if(!mockable){
      return null;
    }
    
    return new Observable<HttpEvent<any>>(observer => {
      if (mockable.isError) {
        // Replay the error
        const errorResponse = new HttpErrorResponse({
          error: mockable.response,
          status: mockable.status,
          statusText: mockable.errorMessage || 'Error',
          headers: new HttpHeaders(mockable.headers),
          url: mockable.url
        });
        observer.error(errorResponse);
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
    const entry: Partial<RecordedEntry> = {
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
          this.storeMockable(entry as RecordedEntry);
        }
      }),
      catchError(error => {
        // Record the error
        if (error instanceof HttpErrorResponse) {
          entry.response = error.error;
          entry.status = error.status;
          entry.isError = true;
          entry.errorMessage = error.statusText || error.message;
        } else {
          entry.response = error.message || 'Unknown error';
          entry.status = 0;
          entry.isError = true;
          entry.errorMessage = 'Network or unknown error';
        }
        this.storeMockable(entry as RecordedEntry);
        
        // Re-throw the error to maintain the original error flow
        return throwError(() => error);
      })
    );
  }

  getHistory(): RecordedEntry[] {
    return [...this.history].reverse();
  }

  clearHistory() {
    this.history = [];
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

export function getRecordedHistory(): RecordedEntry[] {
  return handlerInstance?.getHistory() ?? [];
}

export function clearRecordedHistory() {
  handlerInstance?.clearHistory();
}

export interface RecordedEntry {
  method: string;
  url: string;
  headers: { [key: string]: string };
  body: any;
  response: any;
  status: number;
  timestamp: number;
  isError?: boolean;
  errorMessage?: string;
}
