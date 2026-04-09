export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white text-green-800">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-800 border-t-transparent mb-4" />
      <p className="text-lg font-medium">Loading...</p>
    </div>
  );
}