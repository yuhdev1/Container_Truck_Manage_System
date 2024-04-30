import { Link } from "react-router-dom";
import logo from "../../images/ctms_logo.png";
export default function SignUp() {
  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-primary">
        <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="Logo" className="w-45 h-20" />
          </div>
          <h1 className="text-2xl font-semibold text-center text-black mt-8 mb-6">
            Đăng nhập
          </h1>
          <form>
            <div className="mb-6">
              <label
                htmlFor="email"
                className="block mb-2 text-sm text-gray-600"
              >
                Tài khản
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
            </div>
            <div className="mb-6">
              <label
                htmlFor="password"
                className="block mb-2 text-sm text-gray-600"
              >
                Mật khẩu
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />
              <Link
                to="#"
                className="block text-right text-xs text-cyan-600 mt-2"
              >
                Quên mật khẩu ?
              </Link>
            </div>
            <button
              type="submit"
              className="w-32 bg-primary from-cyan-400 to-cyan-600 text-white py-2 rounded-lg mx-auto block focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 mt-4 mb-6"
            >
              Acceso
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
