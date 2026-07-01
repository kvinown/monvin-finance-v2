export default function WalletsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="h-8 w-48 bg-surface-variant rounded-md mb-2"></div>
          <div className="h-4 w-72 bg-surface-variant rounded-md"></div>
        </div>
        <div className="h-10 w-32 bg-surface-variant rounded-lg"></div>
      </div>

      {/* Wallets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 h-[180px] flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-surface-variant"></div>
              <div className="w-8 h-8 rounded-full bg-surface-variant"></div>
            </div>
            <div className="h-3 w-20 bg-surface-variant rounded-md mb-2 mt-auto"></div>
            <div className="h-6 w-32 bg-surface-variant rounded-md"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
