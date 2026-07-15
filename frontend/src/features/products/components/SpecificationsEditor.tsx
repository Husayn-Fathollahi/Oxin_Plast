'use client';

// ── Types ─────────────────────────────────────────────────────────────────────

export interface SpecRow {
  key: string;
  value: string;
}

/** Convert a raw Prisma Json value into an array of editable rows. */
export function specsToRows(specs: unknown): SpecRow[] {
  if (!specs || typeof specs !== 'object' || Array.isArray(specs)) return [];
  return Object.entries(specs as Record<string, unknown>).map(([key, value]) => ({
    key,
    value: String(value ?? ''),
  }));
}

/** Convert rows back to a plain JSON record for the API, or null if empty. */
export function rowsToSpecs(rows: SpecRow[]): Record<string, string> | null {
  const filled = rows.filter((r) => r.key.trim() !== '');
  if (filled.length === 0) return null;
  return Object.fromEntries(filled.map(({ key, value }) => [key.trim(), value.trim()]));
}

// ── Component ─────────────────────────────────────────────────────────────────

interface SpecificationsEditorProps {
  rows: SpecRow[];
  onChange: (rows: SpecRow[]) => void;
  disabled?: boolean;
}

export function SpecificationsEditor({ rows, onChange, disabled }: SpecificationsEditorProps) {
  function addRow() {
    onChange([...rows, { key: '', value: '' }]);
  }

  function removeRow(index: number) {
    onChange(rows.filter((_, i) => i !== index));
  }

  function updateRow(index: number, field: 'key' | 'value', val: string) {
    onChange(rows.map((row, i) => (i === index ? { ...row, [field]: val } : row)));
  }

  const inputCls =
    'rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 disabled:opacity-50';

  return (
    <div className="space-y-2">
      {rows.length > 0 && (
        <div className="grid grid-cols-[2fr_3fr_auto] gap-2 px-1">
          <span className="text-xs font-medium text-gray-500">Specification</span>
          <span className="text-xs font-medium text-gray-500">Value</span>
          <span />
        </div>
      )}

      {rows.map((row, index) => (
        <div key={index} className="grid grid-cols-[2fr_3fr_auto] gap-2">
          <input
            type="text"
            value={row.key}
            onChange={(e) => updateRow(index, 'key', e.target.value)}
            placeholder="e.g. Capacity"
            disabled={disabled}
            className={inputCls}
          />
          <input
            type="text"
            value={row.value}
            onChange={(e) => updateRow(index, 'value', e.target.value)}
            placeholder="e.g. 200 L"
            disabled={disabled}
            className={inputCls}
          />
          <button
            type="button"
            onClick={() => removeRow(index)}
            disabled={disabled}
            aria-label="Remove row"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-500 hover:bg-red-100 disabled:opacity-50"
          >
            ×
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={addRow}
        disabled={disabled}
        className="w-full rounded-lg border border-dashed border-gray-300 py-2 text-sm text-gray-500 hover:border-brand-400 hover:text-brand-600 disabled:opacity-50"
      >
        + Add specification
      </button>
    </div>
  );
}
