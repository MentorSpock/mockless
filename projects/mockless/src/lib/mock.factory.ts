import { HttpBackend, HttpClient, HttpHandler } from "@angular/common/http";
import { getRecordedHistory, mockHttpHandlerFactory, RecordedEntry } from "./mock.http.handler";

export function MockHttpHandlerFactory(httpClient: HttpBackend): HttpHandler {
    return mockHttpHandlerFactory(httpClient);
}

export function GetRecordedHistory(): RecordedEntry[] {
  return getRecordedHistory();
}