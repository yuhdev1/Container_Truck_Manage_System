import { lazy } from "react";
import SignUp from "../pages/Authentication/SignUp";
const OrderDetailForAdmin = lazy(
  () => import("../pages/Form/OrderDetailForAdmin")
);
const DemoPolyline = lazy(() => import("../pages/Dashboard/DemoPolyline"));
const TimetableForDriver = lazy(
  () => import("../pages/Dashboard/TimetableForDriver")
);

const TransportationContract = lazy(
  () => import("../pages/Dashboard/TransportationContract")
);
const HandoverContract = lazy(
  () => import("../pages/Dashboard/HandoverContract")
);
const HandoverContractForm = lazy(
  () => import("../pages/Form/HandoverContractForm")
);
const TimeDriver = lazy(() => import("../pages/Dashboard/TimeDriver"));
const UpdateOrder = lazy(() => import("../pages/Form/EditOrder"));
const EditOrder = lazy(() => import("../pages/Form/OrderDetail"));
const EditContract = lazy(
  () => import("../pages/Form/EditTrasnportationContract")
);
const CreateOrder = lazy(() => import("../pages/Form/AddOrder"));
const OrderDetailForDriver = lazy(
  () => import("../pages/Form/OrderDetailForDriver")
);
const AddOrder = lazy(() => import("../pages/Form/OrderDetail"));
const UpdateUser = lazy(() => import("../pages/Form/EditUser"));
const CreateUser = lazy(() => import("../pages/Form/AddCustomer"));
const CreateEmployee = lazy(() => import("../pages/Form/AddEmployee"));
const AddContract = lazy(
  () => import("../pages/Form/AddTransportationContract")
);
const User = lazy(() => import("../pages/Dashboard/Customer"));
const Coordination = lazy(() => import("../pages/Dashboard/Assignation"));
const HistoryAssignation = lazy(
  () => import("../pages/Dashboard/HistoryAssignation")
);
const OrderForDriver = lazy(() => import("../pages/Dashboard/OrderForDriver"));
const Order = lazy(() => import("../pages/Dashboard/Order"));
const Account = lazy(() => import("../pages/Dashboard/Accounts"));
const Employee = lazy(() => import("../pages/Dashboard/Employee"));
const ContainerTruck = lazy(() => import("../pages/Dashboard/ContainerTruck"));
const RepairInvoice = lazy(() => import("../pages/Dashboard/RepairInvoice"));
const RepairInvoiceForm = lazy(() => import("../pages/Form/RepairInvoiceForm"));
const CustomerOrder = lazy(() => import("../pages/Dashboard/CustomerOrder"));
const IncidentInvoice = lazy(
  () => import("../pages/Dashboard/IncidentInvoice")
);
const OrderInvoice = lazy(() => import("../pages/Dashboard/OrderInvoice"));
const OrderInvoiceForm = lazy(() => import("../pages/Form/OrderInvoiceForm"));
const IncidentInvoiceForm = lazy(
  () => import("../pages/Form/IncidentInvoiceForm")
);

const ContainerTruckForm = lazy(
  () => import("../pages/Form/ContainerTruckForm")
);

const coreRoutes = [
  {
    path: "/profile",
    component: SignUp,
  },
];

export const customerRoute = [
  {
    path: "/user/order",
    component: CustomerOrder,
  },
  {
    path: "/orders/new",
    component: CreateOrder,
  },
  {
    path: "/orders/:orderId",
    component: UpdateOrder,
  },
];

export const adminRoutes = [
  {
    path: "/truck",
    component: ContainerTruck,
  },
  {
    path: "/truck/new",
    component: ContainerTruckForm,
  },
  {
    path: "/truck/:truckId",
    component: ContainerTruckForm,
  },
  // {
  //   path: "/profile",
  //   component: ContainerTruck,
  // },
  {
    path: "/user",
    component: User,
  },
  {
    path: "/user/adduser",
    component: CreateUser,
  },
  {
    path: "/employee/addemployee",
    component: CreateEmployee,
  },
  {
    path: "/admin/order/:orderId",
    component: OrderDetailForAdmin,
  },

  {
    path: "/users/:userId",
    component: UpdateUser,
  },
  {
    path: "/employee",
    component: Employee,
  },
  {
    path: "/accounts",
    component: Account,
  },
];

export const staffRoutes = [
  {
    path: "/invoice/repair",
    component: RepairInvoice,
  },
  {
    path: "/invoice/repair/new",
    component: RepairInvoiceForm,
  },
  {
    path: "/invoice/repair/:invoiceId",
    component: RepairInvoiceForm,
  },
  {
    path: "/contract/handover",
    component: HandoverContract,
  },
  {
    path: "/contract/handover/new",
    component: HandoverContractForm,
  },
  {
    path: "/contract/handover/:contractId",
    component: HandoverContractForm,
  },
  {
    path: "/invoice/incident/:invoiceId",
    component: IncidentInvoiceForm,
  },
  {
    path: "/invoice/incident/new",
    component: IncidentInvoiceForm,
  },
  {
    path: "/invoice/incident",
    component: IncidentInvoice,
  },
  {
    path: "/invoice/order",
    component: OrderInvoice,
  },
  {
    path: "/invoice/order/new",
    component: OrderInvoiceForm,
  },
  {
    path: "/invoice/order/:invoiceId",
    component: OrderInvoiceForm,
  },
  {
    path: "/profile",
    component: ContainerTruck,
  },

  {
    path: "/neworder",
    component: AddOrder,
  },
  {
    path: "/order",
    component: Order,
  },
  {
    path: "/map",
    component: DemoPolyline,
  },

  {
    path: "/contract/transport",
    component: TransportationContract,
  },

  {
    path: "/orders/new",
    component: CreateOrder,
  },
  {
    path: "/orders/:orderId",
    component: UpdateOrder,
  },

  {
    path: "/neworder/:orderId",
    component: EditOrder,
  },
  {
    path: "/truckdetail/:customerContractId",
    component: EditContract,
  },

  {
    path: "/timetable",
    component: TimeDriver,
  },
  {
    path: "/contract/transport/addcontract",
    component: AddContract,
  },
  {
    path: "/coordination",
    component: Coordination,
  },
  {
    path: "/history",
    component: HistoryAssignation,
  },
];

export const driverRoute = [
  {
    path: "/truck",
    component: ContainerTruck,
  },
  {
    path: "/myorder",
    component: OrderForDriver,
  },
  {
    path: "/orderdetailfordriver/:orderId",
    component: OrderDetailForDriver,
  },
  {
    path: "/driver/timetable",
    component: TimetableForDriver,
  },
];
const routes = [...coreRoutes];
export default routes;
