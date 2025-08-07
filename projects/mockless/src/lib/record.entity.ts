
export interface Record {
  method: string;
  url: string;
  headers: { [key: string]: string };
  body: any;
  response: any;
  status: number;
  statusText?: string;
  timestamp: number;
  isError?: boolean;
}