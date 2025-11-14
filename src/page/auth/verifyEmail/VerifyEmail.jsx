import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/auth/verify-email/${token}`
        );
        setMessage(res.data.message);
        setStatus("success");
      } catch (error) {
        const errMsg =
          error.response?.data?.error ||
          error.response?.data?.message ||
          "Verification failed";
        setMessage(errMsg);
        setStatus("error");
      }
    };
    verify();
  }, [token]);

  // ✅ Auto redirect after success (3s)
  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        window.location.href = "/login";
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center px-4">
      {status === "loading" && (
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-700"></div>
          <p className="text-gray-600">{message}</p>
        </div>
      )}

      {status === "success" && (
        <div className="text-green-600">
          <h2 className="text-2xl font-semibold mb-2">{message}</h2>
          <p>You’ll be redirected to login shortly...</p>
          <Link
            to="/resend-verification"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Resend Verification Email
          </Link>
          <Link
            to="/login"
            className="text-blue-600 underline hover:text-blue-800 mt-3 inline-block"
          >
            Go to Login
          </Link>
        </div>
      )}

      {status === "error" && (
        <div className="text-red-600">
          <h2 className="text-xl font-semibold mb-2">{message}</h2>
          <p className="text-gray-700 mb-4">
            If you didn’t receive the verification email, you can resend it below:
          </p>
          <Link
            to="/resend-verification"
            className="text-blue-600 underline hover:text-blue-800"
          >
            Resend Verification Email
          </Link>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
