import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  // ✅ FIX 1: Get both userId and token from the URL
  const { userId, token } = useParams(); 
  const navigate = useNavigate(); 
  const [status, setStatus] = useState("loading"); // 'loading' | 'success' | 'error'
  const [message, setMessage] = useState("Verifying your email...");

  useEffect(() => {
    // ✅ FIX 2: Validate we have both before calling the API
    if (!userId || !token) {
      setStatus("error");
      setMessage("Invalid verification link. Missing User ID or Token.");
      return;
    }

    const verify = async () => {
      try {
        // ✅ FIX 3: Send both userId and token in the URL
        const res = await axios.get(
          `http://localhost:5000/api/auth/verify-email/${userId}/${token}`
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
  }, [userId, token]);

  // ✅ Auto redirect using React Router
  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [status, navigate]);

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