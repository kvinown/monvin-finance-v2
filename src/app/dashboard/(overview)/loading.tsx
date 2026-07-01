export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
        <div>
          <div className="h-8 w-48 bg-surface-variant rounded-md mb-2"></div>
          <div className="h-4 w-72 bg-surface-variant rounded-md"></div>
        </div>
        <div className="h-10 w-24 bg-surface-variant rounded-lg"></div>
      </div>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Total Balance Card */}
        <div className="md:col-span-8 bg-surface-container-lowest rounded-xl border border-border-subtle p-6 flex flex-col justify-between min-h-[240px]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="h-3 w-24 bg-surface-variant rounded-md mb-4"></div>
              <div className="h-10 w-48 bg-surface-variant rounded-md"></div>
            </div>
            <div className="h-6 w-6 bg-surface-variant rounded-md"></div>
          </div>
          <div className="mt-auto h-24 w-full flex items-end gap-2 px-1">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-full bg-surface-variant rounded-t-sm" style={{ height: `${Math.random() * 60 + 20}%` }}></div>
            ))}
          </div>
        </div>

        {/* Savings Goal Card */}
        <div className="md:col-span-4 bg-surface-variant/30 rounded-xl border border-border-subtle p-6 flex flex-col">
          <div className="h-3 w-24 bg-surface-variant rounded-md mb-6"></div>
          <div className="h-6 w-40 bg-surface-variant rounded-md mb-2"></div>
          <div className="h-4 w-32 bg-surface-variant rounded-md mb-6"></div>
          <div className="mt-auto">
            <div className="flex justify-between mb-2">
              <div className="h-4 w-20 bg-surface-variant rounded-md"></div>
              <div className="h-4 w-10 bg-surface-variant rounded-md"></div>
            </div>
            <div className="w-full h-2 bg-surface-variant rounded-full mb-4"></div>
            <div className="h-3 w-48 bg-surface-variant rounded-md"></div>
          </div>
        </div>

        {/* Wallets Grid */}
        <div className="md:col-span-12">
          <div className="h-6 w-32 bg-surface-variant rounded-md mb-4"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-surface-container-lowest border border-border-subtle rounded-xl p-5">
                <div className="w-10 h-10 rounded-lg bg-surface-variant mb-4"></div>
                <div className="h-3 w-20 bg-surface-variant rounded-md mb-3"></div>
                <div className="h-6 w-32 bg-surface-variant rounded-md"></div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="md:col-span-12 bg-surface-container-lowest border border-border-subtle rounded-xl overflow-hidden mt-4">
          <div className="p-6 border-b border-border-subtle flex justify-between items-center">
            <div className="h-6 w-40 bg-surface-variant rounded-md"></div>
            <div className="h-4 w-16 bg-surface-variant rounded-md"></div>
          </div>
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-surface-variant"></div>
                  <div>
                    <div className="h-4 w-32 bg-surface-variant rounded-md mb-2"></div>
                    <div className="h-3 w-24 bg-surface-variant rounded-md"></div>
                  </div>
                </div>
                <div className="h-4 w-20 bg-surface-variant rounded-md"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
