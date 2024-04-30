export type ContainerTruckResponse = {
  containerTrucks: ContainerTruck[];
  totalPage: number;
};

export type ContainerTruck = {
  truckId?: string;
  licensePlate: string;
  manufacturer: string;
  registrationDate: string;
  capacity: number;
  isActive: boolean;
  driver?: _User;
  attach?: string;
  orderId?: string;
  containerStatus: string;
};

export type _User = {
  userId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  phone?: string;
  email?: string;
  personalId?: string;
  image?: string;
  birthDate?: string;
  userNumber?: string;
};
