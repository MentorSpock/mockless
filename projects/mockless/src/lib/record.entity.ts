
export interface Record {
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