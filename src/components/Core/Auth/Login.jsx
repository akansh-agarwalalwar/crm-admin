import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [verifiedOtp, setVerifiedOtp] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");
    try {
      const response = await fetch("http://localhost:4000/api/admin/login", {
        method: "POST",
        crossDomain: true,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });
      const data = await response.json();
      if (response.status === 200) {
        toast.success("Login Success");
        window.location.href = "/";
        setErrorMessage("You do not have admin access.");
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "An error occurred during login."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/request-password-reset",
        { email }
      );

      if (response.status === 200) {
        setOtpSent(true);
        toast.success("OTP sent to your email.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Failed to send OTP.");
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post(
        "http://localhost:4000/api/auth/verify-otp",
        { email, otp }
      );

      if (response.status === 200) {
        setVerifiedOtp(true);
        toast.success("OTP verified. You can now reset your password.");
      }
    } catch (error) {
      setErrorMessage(error.response?.data?.message || "Invalid OTP.");
    }
  };

  const handleResetPassword = async () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    try {
      const response = await axios.put(
        "http://localhost:4000/api/auth/reset-password",
        { email, password: newPassword }
      );
      if (response.status === 200) {
        toast.success("Password reset successfully.");
        setShowForgotPassword(false);
      }
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Failed to reset password."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center">
          {showForgotPassword ? "Forgot Password" : "Admin Login"}
        </h2>
        {errorMessage && (
          <div className="p-2 text-red-600 bg-red-100 rounded">
            {errorMessage}
          </div>
        )}
        {!showForgotPassword ? (
          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your email"
                disabled={otpSent}
              />
            </div>
            <div className="text-right">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot Password?
              </button>
            </div>

            {/* Send OTP Button */}
            {!otpSent && (
              <button
                type="button"
                onClick={handleForgotPassword}
                className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
              >
                Send OTP
              </button>
            )}

            {/* OTP Section */}
            {otpSent && !verifiedOtp && (
              <>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    OTP
                  </label>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Enter the OTP"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
                >
                  Verify OTP
                </button>
              </>
            )}

            {/* Password Section */}
            {verifiedOtp && (
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="text-sm text-blue-600 hover:underline flex justify-end w-full mt-2"
                >
                  {showPassword ? "Hide" : "Show"} Password
                </button>
              </div>
            )}

            {/* Login Button */}
            {verifiedOtp && (
              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            )}
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your email"
              />
            </div>
            {otpSent && !verifiedOtp && (
              <>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    OTP
                  </label>
                  <input
                    type="text"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Enter the OTP"
                  />
                </div>
                <button
                  onClick={handleVerifyOtp}
                  className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
                >
                  Verify OTP
                </button>
              </>
            )}
            {verifiedOtp && (
              <>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Confirm new password"
                  />
                </div>
                <button
                  onClick={handleResetPassword}
                  className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
                >
                  Reset Password
                </button>
              </>
            )}
            {!otpSent && (
              <button
                onClick={handleForgotPassword}
                className="w-full px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none"
              >
                Send OTP
              </button>
            )}
            <button
              onClick={() => setShowForgotPassword(false)}
              className="text-sm text-blue-600 hover:underline"
            >
              Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
