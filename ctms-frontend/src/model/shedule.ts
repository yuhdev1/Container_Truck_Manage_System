export type schedule = {
    id: string;
    order?: order;
    containerTruck?: ContainerTruck;
    driver?: driver;
    time_stamp: string;
};
export type ContainerTruck = {
    truckId?: string;
    licensePlate: string;
    manufacturer: string;
    registrationDate: string;
    capacity: number;
    isActive: boolean;
};
export type order = {
    orderId: string;
    customerId: string;
    driverId: string;
    orderDate: string;
    deliveryStartDate: string;
    realityDeliveryDate: string;
    expectedDeliveryDate: string;
    payment: string;
    status: string;
    orderNumber: string;
    deliveryAddress: string;
    shippingAddress: string;
    etd: string,
    eta: string,
    driver?: driver;
    customer?: customer;
};
export type customer = {
    userNumber: string;
    userId: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    phone?: string;
    email?: string;
    personalId?: string;
    image?: string;
    birthDate?: string;
    role?: string;
    isActive?: string;
    hasAccount?: string;

};
export type driver = {
    userNumber: string;
    userId: string;
    firstName?: string;
    lastName?: string;
    address?: string;
    phone?: string;
    email?: string;
    personalId?: string;
    image?: string;
    birthDate?: string;
    role?: string;
    isActive?: string;
    hasAccount?: string;
};
