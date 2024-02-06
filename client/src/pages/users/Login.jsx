import React, { useEffect, useState } from "react";
import {
  useLoginMutation,
  useGoogleAuthMutation,
} from "../../utils/slices/userApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setCredentials } from "../../utils/slices/authSlice";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

function Login() {
  const [emailOrUserName, setEmailOrUserName] = useState();
  const [password, setPassword] = useState();
  const [login, { loading }] = useLoginMutation();
  const [googleAuth] = useGoogleAuthMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const validateForm = () => {
    if (!emailOrUserName || !password) {
      toast.error("Please fill in all fields.");
      return false;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    try {
      const isEmail = /\S+@\S+\.\S+/.test(emailOrUserName);

      // Construct the request object based on whether it's an email or a username
      const requestData = isEmail
        ? { email: emailOrUserName, password }
        : { userName: emailOrUserName, password };
      const res = await login(requestData).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (error) {
      // console.log(error)
      toast.error(error.data);
    }
  };

  const handleGoogleAuth = async (decoded) => {
    try {
      const res = await googleAuth(decoded).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (error) {
      toast.error(error.data);
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, []);
  return (
    <>
      <div>
        <div className="w-full h-screen">
          <img
            className="hidden sm:block absolute w-full h-full object-cover"
            src="/img/zoro_walpapper.jpg"
            alt="/"
          />
          <div className="bg-black/60 fixed top-0 left-0 w-full h-screen"></div>
          <div className="fixed w-full px-4 py-24 z-50">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto ">
              <a
                href="#"
                className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
              >
                {/* <img className="w-8 h-8 mr-2" src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg" alt="logo"/> */}
                ZORO
              </a>
              <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-black/75 dark:border-gray-700">
                <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                  <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                    Sign in to ZORO
                  </h1>
                  <form
                    onSubmit={handleSubmit}
                    className="space-y-4 md:space-y-6"
                    action="#"
                  >
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Email or username
                      </label>
                      <input
                        type="text"
                        name="email"
                        onChange={(e) => setEmailOrUserName(e.target.value)}
                        id=""
                        placeholder="Enter email or username"
                        className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required=""
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        password
                      </label>
                      <input
                        type="password"
                        name="password"
                        onChange={(e) => setPassword(e.target.value)}
                        id=""
                        placeholder="Enter password"
                        className="mb-4 bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required=""
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                      Login
                    </button>
                    <span className="text-white flex justify-center">or</span>
                    <div className="flex items-center justify-center">
                      <GoogleLogin
                        onSuccess={(credentialResponse) => {
                          const decoded = jwtDecode(
                            credentialResponse.credential
                          );

                          handleGoogleAuth(decoded);
                        }}
                        onError={() => {
                          console.log("Login Failed");
                        }}
                      />
                    </div>
                    <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                      Don't have an account?{" "}
                      <a
                        href="#"
                        className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                      >
                        <Link to={"/register"}>Sign up</Link>
                      </a>
                    </p>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
