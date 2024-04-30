import { PropagateLoader } from "react-spinners";

const Loader = () => {
  return (
    // <div className="flex h-screen items-center justify-center bg-white">
    //   <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
    // </div>
    <PropagateLoader color="#368bd6" />
  );
};

export default Loader;
