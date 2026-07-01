// bg-[var(--color-primary)]
import "../../app/App";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "../../config/axios";
import { useNavigate } from "react-router-dom";

export default function UserRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 2000);

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post(
        "/auth/register",
        { email, password },
        { withCredentials: true },
      );
      console.log(response);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-20 left-20 w-72 h-72 bg-sky-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-72 h-72 bg-pink-400/20 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="
          w-full
          max-w-md
          bg-white/5
          backdrop-blur-xl
          border
          border-[var(--color-border)]
          rounded-2xl
          p-8
          shadow-2xl
        "
      >
        <h1 className="text-3xl font-bold text-white text-center mb-2">
          Create Account
        </h1>

        <p className="text-gray-400 text-center mb-8">Register to continue</p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* username */}
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Username</label>

            <div className="relative">
              <User
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="text"
                name="username"
                placeholder="Enter username"
                required
                className="
                  w-full
                  bg-black/40
                  border
                  border-gray-700
                  rounded-xl
                  py-3
                  pl-11
                  pr-4
                  text-white
                  focus:border-sky-400
                  focus:ring-2
                  focus:ring-sky-400/30
                  outline-none
                  transition
                "
              />
            </div>
          </div>

          {/* email */}
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Email</label>

            <div className="relative">
              <Mail
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type="email"
                name="email"
                placeholder="Enter email"
                required
                className="
                  w-full
                  bg-black/40
                  border
                  border-gray-700
                  rounded-xl
                  py-3
                  pl-11
                  pr-4
                  text-white
                  focus:border-sky-400
                  focus:ring-2
                  focus:ring-sky-400/30
                  outline-none
                  transition
                "
              />
            </div>
          </div>

          {/* password */}
          <div>
            <label className="text-sm text-gray-300 mb-2 block">Password</label>

            <div className="relative">
              <Lock
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500"
              />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create password"
                required
                className="
                  w-full
                  bg-black/40
                  border
                  border-gray-700
                  rounded-xl
                  py-3
                  pl-11
                  pr-12
                  text-white
                  focus:border-sky-400
                  focus:ring-2
                  focus:ring-sky-400/30
                  outline-none
                  transition
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="
              w-full
              py-3
              rounded-xl
              bg-pink-500
              hover:bg-pink-400
              transition
              duration-200
              text-black
              font-bold
              flex
              justify-center
              items-center
              gap-3
            "
          >
            {loading && (
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
            )}

            {loading ? "Creating..." : "Create Account"}
          </motion.button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Already have an account?{" "}
          <Link to={"/login"}>
            <span className="text-sky-400 cursor-pointer">Login</span>
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
