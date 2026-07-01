import { AlertTriangle, ArrowLeft, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function AuthError({
  title = "Authentication Failed",
  message = "We couldn't verify your account information.",
  suggestion = "Please check your credentials and try again.",
}) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      {/* background blur */}
      <div className="absolute w-72 h-72 bg-sky-500/10 rounded-full blur-3xl top-10 left-10" />
      <div className="absolute w-72 h-72 bg-pink-500/10 rounded-full blur-3xl bottom-10 right-10" />

      <div className="
        relative
        w-full
        max-w-md
        bg-white/5
        backdrop-blur-xl
        border
        border-gray-800
        rounded-3xl
        p-8
        shadow-2xl
        text-center
      ">
        {/* icon */}
        <div className="
          mx-auto
          w-16
          h-16
          rounded-full
          bg-red-500/15
          flex
          items-center
          justify-center
          mb-5
        ">
          <AlertTriangle
            className="text-red-400"
            size={30}
          />
        </div>

        {/* title */}
        <h1 className="text-2xl font-bold text-white mb-3">
          {title}
        </h1>

        {/* message */}
        <p className="text-gray-400 mb-2">
          {message}
        </p>

        {/* suggestion */}
        <p className="text-sm text-gray-500 mb-8">
          {suggestion}
        </p>

        {/* actions */}
        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="
              w-full
              py-3
              rounded-xl
              bg-sky-500
              hover:bg-sky-400
              transition
              duration-200
              font-semibold
              text-black
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <RefreshCw size={18} />
            Try Again
          </button>

          <button
            onClick={() => navigate("/login")}
            className="
              w-full
              py-3
              rounded-xl
              border
              border-gray-700
              hover:bg-white/5
              transition
              duration-200
              text-white
              flex
              items-center
              justify-center
              gap-2
            "
          >
            <ArrowLeft size={18} />
            Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}