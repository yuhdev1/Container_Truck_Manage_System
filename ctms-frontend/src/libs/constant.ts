enum Constant {
  ACCESS_TOKEN = "access_token",
  REFRESH_TOKEN = "ctms_refresh_token",
  BACK_END_URL = "http://localhost:8099",
}

export enum QUERY_KEY {
  CONTAINER_TRUCK = "truck-data",
  CONTAINER_TRUCK_BY_ID = "truck-data-by-id",
  REPAIR_INVOICE = "repair-invoice",
  REPAIR_INVOICE_BY_ID = "repair-invoice-id",
  INCIDENT_INVOICE = "incident-invoice",
  INCIDENT_INVOICE_BY_ID = "incident-invoice-id",
  ORDER_INVOICE = "incident-invoice",
  ORDER_INVOICE_BY_ID = "incident-invoice-id",
  HANDOVER_CONTRACT = "handover-contract",
  HANDOVER_CONTRACT_BY_ID = "handover-contract-id",
  NOTIFICATION = "notification",
  CHART_ONE = "chart-one",
}
export enum CONTAINER_STATUS {
  ACTIVE = "ACTIVE",
  READY = "READY",
  INACTIVE = "INACTIVE",
}
export enum PAYMENT_METHOD {
  BANKING = "Banking",
  CAST = "Tiền mặt",
}
export enum ROLE {
  ADMIN = "ADMIN",
  CUSTOMER = "CUSTOMER",
  STAFF = "STAFF",
  DRIVER = "DRIVER",
}

export default Constant;
