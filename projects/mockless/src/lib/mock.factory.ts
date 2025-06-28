import { HttpBackend, HttpHandler } from "@angular/common/http";
import { mockHttpHandlerFactory } from "./mock.http.handler";
import { Record } from "./record.entity";
import { getRecordedHistory } from "./mock.storage";

export function MockHttpHandlerFactory(httpClient: HttpBackend): HttpHandler {
    return mockHttpHandlerFactory(httpClient);
}

export function GetRecordedHistory(): Record[] {
  return getRecordedHistory();
}