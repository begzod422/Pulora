import { formatNumber, parseNumber } from "@/lib/format";
import { cn } from "@/lib/utils";

interface Props {
  value: number;
  onChange: (v: number) => void;
  label: string;
  suffix?: string;
  className?: string;
}

export function NumberInput({ value, onChange, label, suffix, className }: Props) {
  return (
    <label className={cn("block", className)}>
      <span className="mb-1.5 block text-sm text-muted-foreground">{label}</span>
      <div className="flex items-center rounded-xl border border-input bg-background/60 px-4 focus-within:border-primary">
        <input
          type="text"
          inputMode="numeric"
          value={value ? formatNumber(value) : ""}
          onChange={(e) => onChange(Math.min(parseNumber(e.target.value), 999_999_999_999_999))}
          placeholder="0"
          className="h-12 w-full bg-transparent text-lg font-semibold tabular-nums outline-none placeholder:text-muted-foreground/50"
        />
        {suffix && <span className="ml-2 shrink-0 text-sm text-muted-foreground">{suffix}</span>}
      </div>
    </label>
  );
}
