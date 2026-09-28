"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Replace with your error reporter (Sentry, etc.) if you add one.
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white px-4 text-center">
      <p className="text-sm uppercase tracking-widest text-gray-400">
        Something broke
      </p>
      <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold">
        This page hit an error
      </h1>
      <p className="mt-4 text-gray-400 max-w-md">
        An unexpected error occurred while rendering. Trying again often works.
      </p>
      {error.digest && (
        <p className="mt-2 text-xs text-gray-400">Reference: {error.digest}</p>
      )}
      <div className="mt-8 flex flex-wrap gap-3 justify-center">
        <button
          onClick={reset}
          className="px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition"
        >
          Try again
        </button>
        <Link
          href="/"
          className="px-6 py-3 rounded-lg border border-white/20 hover:bg-white/10 transition"
        >
          Back to home
        </Link>
      </div>
    </div>
  );
}
