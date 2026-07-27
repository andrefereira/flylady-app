export default function ChecklistItem({ label, checked, onToggle, onDelete }) {
  return (
    <div className="flex items-center gap-3 py-2 group">
      <button
        type="button"
        onClick={onToggle}
        aria-pressed={checked}
        className={`flex-shrink-0 w-6 h-6 rounded-md border-2 flex items-center justify-center transition ${
          checked
            ? 'bg-teal-600 border-teal-600 text-white'
            : 'border-slate-300 hover:border-teal-400'
        }`}
      >
        {checked && '✓'}
      </button>
      <span className={`flex-1 text-sm ${checked ? 'line-through text-slate-400' : 'text-slate-700'}`}>
        {label}
      </span>
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          className="opacity-100 sm:opacity-0 sm:group-hover:opacity-100 text-slate-300 hover:text-red-500 text-sm transition"
          title="Remover"
        >
          ✕
        </button>
      )}
    </div>
  )
}
