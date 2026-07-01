export default function VaultsLoading() {
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

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 h-[220px] flex flex-col justify-between">
            <div className="h-6 w-32 bg-surface-variant rounded-md mb-2 mt-2"></div>
            <div className="h-4 w-48 bg-surface-variant rounded-md mb-4"></div>
            
            <div className="mt-auto">
              <div className="flex justify-between items-end mb-2">
                <div className="h-6 w-24 bg-surface-variant rounded-md"></div>
                <div className="h-4 w-8 bg-surface-variant rounded-md"></div>
              </div>
              <div className="w-full h-2 bg-surface-variant rounded-full mb-4"></div>

              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border-subtle">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="w-6 h-6 rounded-full bg-surface-variant border border-surface-container-lowest"></div>
                  ))}
                </div>
                <div className="h-3 w-16 bg-surface-variant rounded-md"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
