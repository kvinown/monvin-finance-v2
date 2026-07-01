export default function TransactionsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-6">
        <div>
          <div className="h-8 w-48 bg-surface-variant rounded-md mb-2"></div>
          <div className="h-4 w-72 bg-surface-variant rounded-md"></div>
        </div>
        <div className="flex gap-2">
          <div className="h-10 w-24 bg-surface-variant rounded-lg"></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-surface-variant p-1 rounded-lg w-full sm:w-64 mb-6 h-10"></div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="h-10 bg-surface-variant rounded-lg"></div>
        <div className="h-10 bg-surface-variant rounded-lg"></div>
        <div className="h-10 bg-surface-variant rounded-lg"></div>
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest border border-border-subtle rounded-xl shadow-sm overflow-hidden">
        <div className="w-full">
          <div className="h-12 bg-surface-container-lowest border-b border-border-subtle"></div>
          <div className="divide-y divide-border-subtle">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="flex justify-between items-center p-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-surface-variant"></div>
                  <div>
                    <div className="h-4 w-32 bg-surface-variant rounded-md mb-2"></div>
                    <div className="h-3 w-20 bg-surface-variant rounded-md"></div>
                  </div>
                </div>
                <div className="h-4 w-16 bg-surface-variant rounded-md hidden md:block"></div>
                <div className="h-4 w-24 bg-surface-variant rounded-md hidden md:block"></div>
                <div className="h-4 w-20 bg-surface-variant rounded-md text-right"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
