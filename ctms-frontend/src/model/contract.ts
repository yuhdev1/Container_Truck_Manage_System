import { ContainerTruck, Driver } from "./container_truck";

export type HandoverContractResponse = {
  vehicalHandoverContracts: HandoverContract[];
  totalPage: number;
};

export type HandoverContract = {
  handingContractId: string;
  driver?: Driver;
  truck?: ContainerTruck;
  contractNumber: string;
  startDate: string;
  endDate: string;
  salary: number;
  note: string;
  attach: string;
};

export type HandoverContractRequest = {
  vehicleHanoverContractDTO: HandoverContract;
  truckId: string;
  userId: string;
};
