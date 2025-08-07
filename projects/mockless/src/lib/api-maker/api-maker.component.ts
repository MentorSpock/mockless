import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-api-maker',
  templateUrl: './api-maker.component.html',
  styleUrls: ['./api-maker.component.css']
})
export class ApiMakerComponent {

  method: string = 'GET';
  url: string = 'https://fake-json-api.mock.beeceptor.com/users';
  headers: { key: string, value: string }[] = [
  { key: '', value: '' }
];

  body: string = '';
  result: any = null;

  constructor(private http: HttpClient) {}
addHeader() {
  this.headers.push({ key: '', value: '' });
}

removeHeader(index: number) {
  this.headers.splice(index, 1);
}

sendRequest() {
  const parsedHeaders = this.headers
    .filter(h => h.key.trim() !== '')
    .reduce((acc, h) => ({ ...acc, [h.key]: h.value }), {});

  const httpHeaders = new HttpHeaders(parsedHeaders);

  const options = {
    headers: httpHeaders
  };

  const parsedBody = this.body ? JSON.parse(this.body) : undefined;

  this.http.request(this.method, this.url, {
    ...options,
    body: parsedBody,
    observe: 'response'
  }).subscribe({
    next: res => this.result = res,
    error: err => {
      console.error('Request failed:', err);
      this.result = err;
    }
  });
}

}
