import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoutes from "../components/ProtectedRoute";
import DefaultLayout from "../layout/DefaultLayout";
import PublicRoutes from "../components/PublicRoutes";
import SignIn from "../pages/Authentication/SignIn";
import PermissionDenied from "../components/PermissionDenied";
import { adminRoutes, staffRoutes, customerRoute, driverRoute } from ".";
import { Suspense } from "react";
import SignUp from "../pages/Authentication/SignUp";
import EditUser from "../pages/Form/EditUser";

import ECommerce from "../pages/Dashboard/ECommerce";
import Loader from "../components/Loader";
import ChangePasswordForm from "../pages/Form/ChangePasswordForm";
import ForgotPassword from "../pages/Authentication/ForgotPassword";
import Empty from "../pages/Dashboard/Empty";
import NotFoundPage from "../pages/Dashboard/NotFoundPage";

function MainRoutes() {
  return (
    <Routes>
      {/** Protected Routes */}
      {/** Wrap all Route under ProtectedRoutes element */}
      <Route path="/" element={<ProtectedRoutes />}>
        <Route path="/" element={<DefaultLayout />}>
          {/* All route of user */}
          <Route path="/changepass" element={<ChangePasswordForm />} />
          <Route path="/denied" element={<PermissionDenied />} />
          <Route element={<ProtectedRoutes roleRequired={["CUSTOMER"]} />}>
            {/* Generate all route of user */}
            {customerRoute.map((routes, index) => {
              const { path, component: Component } = routes;
              return (
                <Route
                  key={index}
                  path={path}
                  element={
                    <Suspense fallback={<Loader />}>
                      <Component />
                    </Suspense>
                  }
                />
              );
            })}
          </Route>

          {/* All route of admin */}
          <Route element={<ProtectedRoutes roleRequired={["ADMIN"]} />}>
            {/* Generate all route of user */}
            {adminRoutes.map((routes, index) => {
              const { path, component: Component } = routes;
              return (
                <Route
                  key={index}
                  path={path}
                  element={
                    <Suspense fallback={<Loader />}>
                      <Component />
                    </Suspense>
                  }
                />
              );
            })}
          </Route>

          <Route
            element={<ProtectedRoutes roleRequired={["STAFF", "ADMIN"]} />}
          >
            {/* Generate all route of user */}
            {staffRoutes.map((routes, index) => {
              const { path, component: Component } = routes;
              return (
                <Route
                  key={index}
                  path={path}
                  element={
                    <Suspense fallback={<Loader />}>
                      <Component />
                    </Suspense>
                  }
                />
              );
            })}
          </Route>
          <Route
            element={<ProtectedRoutes roleRequired={["STAFF", "ADMIN"]} />}
          >
            {/* Generate all route of driver */}

            <Route
              path="/dashboard"
              element={
                <Suspense fallback={<Loader />}>
                  <ECommerce />
                </Suspense>
              }
            />
          </Route>
          <Route element={<ProtectedRoutes roleRequired={["DRIVER"]} />}>
            {/* Generate all route of driver */}
            {driverRoute.map((routes, index) => {
              const { path, component: Component } = routes;
              return (
                <Route
                  key={index}
                  path={path}
                  element={
                    <Suspense fallback={<Loader />}>
                      <Component />
                    </Suspense>
                  }
                />
              );
            })}
          </Route>
          <Route index element={<Empty />} />
          <Route path="/*" element={<NotFoundPage />} />
        </Route>
      </Route>

      {/** Public Routes */}
      {/** Wrap all Route under PublicRoutes element */}
      <Route element={<PublicRoutes />}>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/forgot" element={<ForgotPassword />} />
      </Route>
      {/* <Route path="/signup" element={<SignUp />} /> */}

      {/** Permission denied route */}
      {/* <Route path="/denied" element={<PermissionDenied />} /> */}
    </Routes>
  );
}

export default MainRoutes;
