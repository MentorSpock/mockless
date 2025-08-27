import { Record } from "./record.entity";

export type Action = {
  text: string;
  callback: (record: Record) => void;
}