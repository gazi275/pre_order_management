export default function Loader({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "h-4 w-4 border-2",
    md: "h-5 w-5 border-2",
    lg: "h-8 w-8 border-3",
  };

  return (
    <div
      className={`
        ${sizeClasses[size]}
        animate-spin rounded-full
        border-white border-t-transparent
      `}
      role="status"
      aria-label="Loading"
    />
  );
}
