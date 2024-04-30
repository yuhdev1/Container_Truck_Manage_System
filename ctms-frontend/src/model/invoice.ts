import { ContainerTruck, _User } from "./truck";

export type RepairInvoiceResponse = {
  repairInvoices: RepairInvoice[];
  totalPage: number;
};
export type RepairInvoice = {
  repairInvoiceId?: string;
  invoiceNumber: string;
  repairDate: string;
  description: string;
  repairCost: number;
  paymentMethod: string;
  serviceProvider: string;
  serviceProviderContact: string;
  attach: string;
  truck?: ContainerTruck;
  tax: number;
};
export type RepairInvoiceRequest = {
  repairInvoiceDTO: RepairInvoice;
  truckId?: string;
  file?: File;
};
//Incident invoices
export type IncidentInvoice = {
  incidentInvoiceId?: string;
  description: string;
  paymentMethod: string;
  paymentDate: string;
  invoiceNumber: string;
  cost: number;
  attach: string;
  driver?: _User;
  order?: _Order;
  tax: number;
};
export type IncidentInvoiceResponse = {
  incidentInvoices: IncidentInvoice[];
  totalPage: number;
};
export type IncidentInvoicesRequest = {
  incidentInvoiceDTO: IncidentInvoice;
  orderId: string;
  driverId: string;
};
export type OrderInvoiceResponse = {
  orderInvoices: OrderInvoice[];
  totalPage: number;
};
export type GetUserResponse = {
  content: _User[];
};
export type GetOrderResponse = {
  content: _Order[];
};
export type _Order = {
  orderId: string;
  customerId: string;
  customer: _User;
  driverId: string;
  orderDate: string;
  deliveryStartDate: string;
  realityDeliveryDate: string;
  expectedDeliveryDate: string;
  payment: string;
  status: string;
  orderNumber: string;
};
export type OrderInvoicesRequest = {
  orderInvoiceDTO: OrderInvoice;
  orderId: string;
  customerId: string;
};

export type OrderInvoice = {
  orderInvoiceId?: string;
  note: string;
  paymentMethod: string;
  paymentDate: string;
  invoiceNumber: string;
  shippingCost: number;
  tax: number;
  attach: string;
  customer?: _User;
  order?: _Order;
};
