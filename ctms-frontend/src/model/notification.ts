import { _Order } from "./invoice";
import { _User } from "./truck";

export type Notification = {
  id: string;
  customer: _User;
  order: _Order;
  content: string;
  timestamp: string;
  receiver: string;
  seen: boolean;
};

export type NotificationResponse = {
  content: Notification[];
};
