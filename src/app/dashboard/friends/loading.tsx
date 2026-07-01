export default function FriendsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-surface-variant rounded-md mb-2"></div>
        <div className="h-4 w-72 bg-surface-variant rounded-md"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
            <div className="h-6 w-32 bg-surface-variant rounded-md mb-4"></div>
            <div className="space-y-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-border-subtle rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-surface-variant"></div>
                    <div>
                      <div className="h-4 w-32 bg-surface-variant rounded-md mb-2"></div>
                      <div className="h-3 w-20 bg-surface-variant rounded-md"></div>
                    </div>
                  </div>
                  <div className="h-8 w-24 bg-surface-variant rounded-md"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6">
            <div className="h-6 w-32 bg-surface-variant rounded-md mb-2"></div>
            <div className="h-4 w-48 bg-surface-variant rounded-md mb-6"></div>
            <div className="h-10 w-full bg-surface-variant rounded-lg mb-4"></div>
            <div className="h-10 w-full bg-surface-variant rounded-lg"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
