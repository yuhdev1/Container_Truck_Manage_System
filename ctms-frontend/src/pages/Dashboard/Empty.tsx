import { Link } from "react-router-dom";
import logo from "../../images/logo-no-background.png";
import useAuth from "../../libs/hook/useAuth";

function Empty() {
  const { username } = useAuth();
  return (
    <div className=" justify-center items-center h-[70vh]">
      <h1 className="text-2xl text-black font-bold">
        Xin chào, <span className="text-primary">{username}</span>
      </h1>
    </div>
  );
}

export default Empty;
