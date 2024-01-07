import React, { useState, useEffect } from "react";
import OTPInput from "react-otp-input";
import { useNavigate, useParams } from "react-router-dom";
import {
  useVerifyOtpMutation,
  useRegisterMutation,
} from "../../utils/slices/userApiSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../utils/slices/authSlice";

const OTPVerificationPage = () => {
  const [otp, setOTP] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(60);
  const { email } = useParams();
  const [verifyOtp] = useVerifyOtpMutation();
  const [resendOtp] = useRegisterMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
     const { userInfo } = useSelector((state) => state.auth);



  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if(!otp){
      toast.error("Please enter the OTP!");
      return
    }
    if(otp.length !== 4){
      toast.error('Please fill!');
      return
    }
    try {
      setIsVerifying(true);
      // Call API to verify OTP
      const res = await verifyOtp({ email, otp }).unwrap()

      setIsVerifying(false);
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (error) {
      toast.error(error.data);
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    // Call API to resend OTP
    await resendOtp({ email }).unwrap();
    // Set a cooldown period to prevent frequent resending
    setResendCooldown(60); // Set to the desired cooldown time in seconds
  };

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
    // Countdown timer for resend cooldown
    if (resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => Math.max(0, prev - 1));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendCooldown]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            OTP Verification
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Please enter the verification code send to{" "}
            <span className="font-bold">{email}</span>
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleVerifyOTP}>
          <div className="rounded-md shadow-sm -space-y-px">
            <OTPInput
              value={otp}
              onChange={(otp) => setOTP(otp)}
              numInputs={4}
              isInputNum
              containerStyle="flex justify-center"
              inputStyle={{
                width: "3rem",
                height: "3rem",
                margin: "20px 1rem",
                fontSize: "1rem",
                borderRadius: 4,
                border: "2px solid rgba(0,0,0,0.3)",
              }}
              renderSeparator={<span className="mx-2">-</span>}
              renderInput={(props) => <input {...props} />}
            />
          </div>

          <div className="flex items-center justify-center">
            <button
              type="submit"
              className="group relative w-4/5 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              disabled={isVerifying}
            >
              {isVerifying ? "Verifying..." : "Verify OTP"}
            </button>
          </div>

          {/* {verificationResult && (
            <div
              className={`text-center text-sm mt-2 ${
                verificationResult.success ? "text-green-600" : "text-red-600"
              }`}
            >
              {verificationResult.message}
            </div>
          )} */}
        </form>

        <div className="flex items-center justify-center mt-4">
          {resendCooldown === 0 ? (
            <button
              className="text-blue-500 hover:underline"
              onClick={handleResendOTP}
            >
              Resend OTP
            </button>
          ) : (
            <p className="text-gray-500">
              Resend OTP in {resendCooldown} seconds
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OTPVerificationPage;
