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
    paid: boolean;
    price: string;
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