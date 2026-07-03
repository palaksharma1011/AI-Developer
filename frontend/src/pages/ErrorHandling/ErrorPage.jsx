import { AlertTriangle, RefreshCw } from "lucide-react";

export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-red-500/20 bg-white/5 backdrop-blur-xl p-8 text-center">

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10">
          <AlertTriangle
            className="text-red-400"
            size={30}
          />
        </div>

        <h1 className="mb-3 text-2xl font-bold text-white">
          Something went wrong
        </h1>

        <p className="mb-8 text-gray-400">
          An unexpected error occurred.
          Please refresh the page.
        </p>

        <button
          onClick={() => window.location.reload()}
          className="
            flex
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-sky-500
            py-3
            font-semibold
            text-black
            transition
            hover:scale-[1.02]
          "
        >
          <RefreshCw size={18} />
          Reload Page
        </button>

      </div>
    </div>
  );
}