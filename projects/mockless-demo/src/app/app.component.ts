import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
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
    body: parsedBody
  }).subscribe({
    next: res => this.result = res,
    error: err => this.result = err
  });
}

}
