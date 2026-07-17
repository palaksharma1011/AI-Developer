import "../../app/App.css";

import { useState } from "react";
import { useContext } from "react";
import { UserContext } from "../../context/User.context";
import { motion } from "framer-motion";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../config/axios";

export default function UserLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { setUser } = useContext(UserContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    // api call
    setTimeout(() => {
      setLoading(false);
    }, 2000);
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const response = await axios.post(
        "/auth/login",
        { email, password },
        { withCredentials: true },
      );

      setUser(response.data.user);
      console.log(response.data.user);
      navigate("/");
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* background blur */}
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
          Welcome Back
        </h1>

        <p className="text-gray-400 text-center mb-8">Login to continue</p>

        <form onSubmit={handleSubmit} className="space-y-5">
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
                placeholder="Enter your email"
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
                  outline-none
                  transition
                  duration-200
                  focus:border-sky-400
                  focus:ring-2
                  focus:ring-sky-400/30
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
                placeholder="Enter password"
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
                  outline-none
                  transition
                  duration-200
                  focus:border-sky-400
                  focus:ring-2
                  focus:ring-sky-400/30
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

          {/* options */}
          <div className="flex justify-between items-center text-sm">
            <label className="flex gap-2 text-gray-400">
              <input type="checkbox" name="rememberMe" />
              Remember me
            </label>

            <button
              type="button"
              className="text-sky-400 hover:text-sky-300 transition"
            >
              Forgot password?
            </button>
          </div>

          {/* button */}
          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={loading}
            className="
              w-full
              py-3
              rounded-xl
              bg-sky-500
              hover:bg-sky-400
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

            {loading ? "Logging in..." : "Login"}
          </motion.button>
        </form>

        <p className="text-center text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link to={"/register"}>
            <span className="text-pink-400 cursor-pointer">Register</span>
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
