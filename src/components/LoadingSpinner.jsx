import { Spinner } from "@heroui/react";

export default function LoadingSpinner({ label = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] gap-3">
      <Spinner size="lg" color="primary" />
      <p className="text-default-500 text-sm">{label}</p>
    </div>
  );
}
