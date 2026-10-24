'use client';

interface Props {
  options: [value: string, name: string][];
  value: string[];
  onChange: (next: string[]) => void;
  multiple?: boolean; // false = faqat bittasi tanlanadi
}

// Chip ko‘rinishidagi tanlash (bitta yoki bir nechta). Klaviatura va ekran o‘quvchi uchun aria-pressed bor.
export function ChipSelect({ options, value, onChange, multiple = true }: Props) {
  function click(v: string) {
    if (!multiple) return onChange([v]);
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  }
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(([v, name]) => {
        const on = value.includes(v);
        return (
          <button key={v} type="button" aria-pressed={on} onClick={() => click(v)} className={`chip ${on ? 'chip-on' : ''}`}>
            {name}
          </button>
        );
      })}
    </div>
  );
}
