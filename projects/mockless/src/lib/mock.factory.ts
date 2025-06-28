import { HttpBackend, HttpHandler } from "@angular/common/http";
import { mockHttpHandlerFactory } from "./mock.http.handler";

export function MockHttpHandlerFactory(httpClient: HttpBackend): HttpHandler {
    return mockHttpHandlerFactory(httpClient);
}