import { Suspense, lazy, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import routes from "./routes";
import SignIn from "./pages/Authentication/SignIn";
import ECommerce from "./pages/Dashboard/ECommerce";
import MainRoutes from "./routes/MainRoutes";
import Loader from "./components/Loader";

const DefaultLayout = lazy(() => import("./layout/DefaultLayout"));

function App() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return loading ? (
    <Loader />
  ) : (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        containerClassName="overflow-auto"
      />

      <MainRoutes />
    </>
  );
}

export default App;
