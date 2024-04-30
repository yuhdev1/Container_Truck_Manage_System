export type workday = {
    id: string;
    containerTruck: ContainerTruck;
    order: order;
    from: string;
    to: string;


};
export type ContainerTruck = {
    truckId?: string;
    licensePlate: string;
    manufacturer: string;
    registrationDate: string;
    capacity: number;
    isActive: boolean;
    driver?: driver;
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