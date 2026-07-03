import { WifiOff } from "lucide-react";

export default function NetworkError({
  retry
}) {
  return (
    <div className="rounded-2xl border border-orange-500/20 bg-orange-500/5 p-6">

      <div className="mb-4 flex items-center gap-3">
        <WifiOff
          size={24}
          className="text-orange-400"
        />

        <h2 className="text-lg font-semibold text-white">
          No Internet Connection
        </h2>
      </div>

      <p className="mb-6 text-gray-400">
        Please check your internet
        connection and try again.
      </p>

      <button
        onClick={retry}
        className="
          rounded-xl
          bg-orange-500
          px-5
          py-2
          font-medium
          text-black
        "
      >
        Retry
      </button>
    </div>
  );
}