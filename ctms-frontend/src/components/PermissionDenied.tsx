import { useNavigate } from "react-router-dom";

const PermissionDenied = () => {
  const navigate = useNavigate();
  const handleClick = () => {
    localStorage.removeItem("ctms_user");
    navigate("/signin");
  };
  return (
    <div className="tab1 text-black">
      <h2>Permission denied!</h2>
      <p>
        <span
          className="hover:bg-primary hover:cursor-pointer"
          onClick={handleClick}
        >
          Click here&nbsp;
        </span>
        to go to login page
      </p>
    </div>
  );
};

export default PermissionDenied;
