import { AlertCircle } from "lucide-react";

export default function ErrorAlert({
  message
}) {
  if (!message) return null;

  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-xl
        border
        border-red-500/20
        bg-red-500/10
        p-3
      "
    >
      <AlertCircle
        size={18}
        className="text-red-400"
      />

      <p className="text-sm text-red-300">
        {message}
      </p>
    </div>
  );
}

// USAGE
{/* <ErrorAlert
    message={error}
/> */}