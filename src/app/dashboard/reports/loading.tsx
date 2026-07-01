export default function ReportsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-surface-variant rounded-md mb-2"></div>
        <div className="h-4 w-72 bg-surface-variant rounded-md"></div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-surface-variant/30 border border-border-subtle rounded-xl p-6 h-28"></div>
        <div className="bg-surface-variant/30 border border-border-subtle rounded-xl p-6 h-28"></div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 h-[400px]">
          <div className="h-6 w-48 bg-surface-variant rounded-md mb-6"></div>
          <div className="h-64 w-full bg-surface-variant rounded-lg"></div>
        </div>

        <div className="bg-surface-container-lowest border border-border-subtle rounded-xl p-6 h-[400px]">
          <div className="h-6 w-48 bg-surface-variant rounded-md mb-6"></div>
          <div className="h-64 w-64 rounded-full bg-surface-variant mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
