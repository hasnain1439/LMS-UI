import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function VerifyEmail() {
    const {token} = useParams()
    const [message, setMessage] = useState("Verifying your email...")
    useEffect(()=>{
        const verify = async ()=>{
            try{
                const res = await axios.get(`http://localhost:5000/api/auth/verify-email/${token}`);
                setMessage(res.data.message)
            }catch(error){
                console.log(error.response?.data?.message || "Verification Failure")
            }
        }
        verify();
    }, [token])
    return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">{message}</h2>
      {message === "Email verified successfully" && (
        <Link
          to="/login"
          className="text-blue-600 underline hover:text-blue-800"
        >
          Go to Login
        </Link>
      )}
    </div>
  );
}

export default VerifyEmail;
