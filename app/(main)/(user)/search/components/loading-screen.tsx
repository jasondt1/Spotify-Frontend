export default function LoadingScreen() {
  return (
    <div className="p-6">
      <div className="relative overflow-hidden rounded-2xl bg-neutral-900/60 border border-neutral-800">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-[shimmer_1.6s_infinite]" />
        <div className="p-6 flex flex-col gap-6">
          <div className="flex gap-6">
            <div className="w-2/5">
              <div className="h-40 rounded-xl bg-neutral-800/80 animate-pulse" />
            </div>
            <div className="w-3/5 space-y-4">
              <div className="h-6 w-40 rounded bg-neutral-800/80 animate-pulse" />
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 rounded bg-neutral-800/80 animate-pulse"
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="h-6 w-32 rounded bg-neutral-800/80 animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-44 rounded-xl bg-neutral-800/80 animate-pulse"
                />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            <div className="h-6 w-32 rounded bg-neutral-800/80 animate-pulse" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="h-44 rounded-xl bg-neutral-800/80 animate-pulse"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 right-6">
        <div className="h-10 w-10 rounded-full border border-neutral-700 bg-neutral-900/80 backdrop-blur flex items-center justify-center">
          <div className="h-5 w-5 rounded-full border-2 border-neutral-500 border-t-transparent animate-spin" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </div>
  )
}
