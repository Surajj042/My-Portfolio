"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
          <p className="text-sm uppercase tracking-widest text-gray-400">
            Application error
          </p>
          <h1 className="mt-3 text-4xl sm:text-5xl font-extrabold">
            Something went badly wrong
          </h1>
          <p className="mt-4 text-gray-400 max-w-md">
            The site failed to load. Reloading the page should resolve it.
          </p>
          {error.digest && (
            <p className="mt-3 text-xs text-gray-400">
              Reference: {error.digest}
            </p>
          )}
          <button
            onClick={reset}
            className="mt-8 px-6 py-3 rounded-lg bg-white text-black font-semibold hover:bg-gray-200 transition"
          >
            Reload
          </button>
        </div>
      </body>
    </html>
  );
}
