import { ErrorIcon } from "@/lib/icons";

export default function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-2 mt-2 mb-1">
      <ErrorIcon />
      <span className="text-sm text-red-300">{message}</span>
    </div>
  );
}

