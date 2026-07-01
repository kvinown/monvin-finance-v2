export default function SavingsLoading() {
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
          <div key={i} className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 h-[200px] flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div className="h-6 w-32 bg-surface-variant rounded-md"></div>
              <div className="h-6 w-6 bg-surface-variant rounded-full"></div>
            </div>
            
            <div className="h-4 w-24 bg-surface-variant rounded-md mb-2 mt-4"></div>

            <div className="mt-auto">
              <div className="flex justify-between items-end mb-2">
                <div className="h-6 w-24 bg-surface-variant rounded-md"></div>
                <div className="h-4 w-8 bg-surface-variant rounded-md"></div>
              </div>
              <div className="w-full h-2 bg-surface-variant rounded-full"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
