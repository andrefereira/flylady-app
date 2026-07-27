export default function ProgressBar({ pct, color = 'bg-teal-600' }) {
  const value = Math.max(0, Math.min(100, Math.round(pct)))
  return (
    <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
      <div
        className={`h-full ${color} rounded-full transition-all`}
        style={{ width: `${value}%` }}
      />
    </div>
  )
}
