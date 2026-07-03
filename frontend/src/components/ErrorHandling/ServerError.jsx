import { ServerCrash } from "lucide-react";

export default function ServerError() {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6">

      <div className="mb-4 flex items-center gap-3">
        <ServerCrash
          size={24}
          className="text-red-400"
        />

        <h2 className="text-lg font-semibold text-white">
          Server Unavailable
        </h2>
      </div>

      <p className="text-gray-400">
        Our servers are having trouble
        right now. Please try again
        in a few minutes.
      </p>

    </div>
  );
}