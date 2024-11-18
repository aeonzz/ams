import Link from "next/link";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="mb-4 text-4xl font-bold">Unauthorized Access</h1>
      <p className="mb-4">You do not have permission to access this page.</p>
      <Link
        href="/dashboard"
        className="text-blue-500 hover:underline"
        prefetch
      >
        Return to Home
      </Link>
    </div>
  );
}
