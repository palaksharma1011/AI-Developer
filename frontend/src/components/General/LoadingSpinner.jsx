export default function LoadingSpinner({ text = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <div
        className="
          h-10
          w-10
          animate-spin
          rounded-full
          border-4
          border-sky-400
          border-t-transparent
        "
      />

      <p className="text-sm text-gray-400">{text}</p>
    </div>
  );
}
