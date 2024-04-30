export type DashboardInfoResponse = {
  revenue: number;
  profit: number;
  expense: number;
  totalOrder: number;
  totalUser: number;
};

export type ChartOneData = {
  months: string[];
  data: number[];
  max: number;
};
export type ChartTwoData = {
  incidentExpense: number;
  repairExpense: number;
};

export type LocationSuggestResponse = {
  code: string;
  message: string;
  result: Location[];
};

export type Location = {
  id: string;
  name: string;
  address: string;
  location: { lng: number; lat: number };
  type: string[];
};
