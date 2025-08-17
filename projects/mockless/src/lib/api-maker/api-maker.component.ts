import { Component, Input } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Record } from '../record.entity';

@Component({
  selector: 'app-api-maker',
  templateUrl: './api-maker.component.html',
  styleUrls: ['./api-maker.component.css']
})
export class ApiMakerComponent {

  @Input() record!: Record;

  method: string = '';
  url: string = '';
  headers: { key: string, value: string }[] = [
  ];

  body: string = '';
  result: any = null;

  constructor(private http: HttpClient) {
    setTimeout(() => {

      console.debug('API Maker initialized with record:', this.record);
      if (!this.record) {
        return;
      }
      this.method = this.record.method;
      this.url = this.record.url;
      this.headers = Object.entries(this.record.headers || {}).map(([key, value]) => ({ key, value }));
      this.body = this.record.body;
    }, 0);
  }
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
      error: err => {
        console.error('Request failed:', err);
        this.result = err;
      }
    });
  }

}
