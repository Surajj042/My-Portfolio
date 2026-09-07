import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4">
      <h1 className="text-7xl font-bold mb-4">404</h1>
      <p className="text-xl text-gray-300 mb-8">Page not found</p>
      <Link
        href="/"
        className="px-6 py-3 rounded-full font-medium text-white bg-gradient-to-r from-[#6dd5fa] via-[#2a5298] to-[#302b53] shadow-lg hover:opacity-90 transition-opacity"
      >
        Back to Home
      </Link>
    </div>
  );
}
