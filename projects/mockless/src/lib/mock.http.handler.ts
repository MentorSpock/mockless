import {
  HttpHandler,
  HttpRequest,
  HttpEvent,
  HttpResponse,
  HttpBackend,
  HttpHeaders,
  HttpClient
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

export interface RecordedEntry {
  method: string;
  url: string;
  headers: { [key: string]: string };
  body: any;
  response: any;
  status: number;
  timestamp: number;
}

@Injectable()
export class HistoryRecorderHandler implements HttpHandler {
  private history: RecordedEntry[] = [];

  constructor(readonly httpClient: HttpBackend) {
  }

  handle(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    console.log('[MockLess] Handling request:', req.method, req.urlWithParams);
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
          this.history.push(entry as RecordedEntry);
        }
        console.log('[MockLess] Request handled:', this.history);
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
    console.log('[MockLess] Creating handler instance');
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
}
