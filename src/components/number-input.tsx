import { cn } from "@/lib/utils";
import NumberFlow from "@number-flow/react";
import clsx from "clsx/lite";
import { Minus, Plus } from "lucide-react";
import * as React from "react";
import { Button } from "@/components/ui/button";

type Props = {
  value?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
  onChange?: (value: number) => void;
  className?: string;
  isDecimal?: boolean;
};

export default function NumberInput({
  value = 0,
  min = -Infinity,
  max = Infinity,
  onChange,
  className,
  disabled,
  isDecimal = false,
}: Props) {
  const defaultValue = React.useRef(value);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [animated, setAnimated] = React.useState(true);
  const [showCaret, setShowCaret] = React.useState(true);

  const handleInput: React.ChangeEventHandler<HTMLInputElement> = ({
    currentTarget: el,
  }) => {
    setAnimated(false);
    if (el.value === "") {
      onChange?.(defaultValue.current);
      return;
    }
    const num = isDecimal ? parseFloat(el.value) : parseInt(el.value);
    if (
      isNaN(num) ||
      (min != null && num < min) ||
      (max != null && num > max)
    ) {
      el.value = String(value);
    } else {
      el.value = isDecimal ? num.toFixed(2) : String(num);
      onChange?.(num);
    }
  };

  const handlePointerDown =
    (diff: number) => (event: React.PointerEvent<HTMLButtonElement>) => {
      setAnimated(true);
      if (event.pointerType === "mouse") {
        event?.preventDefault();
        inputRef.current?.focus();
      }
      const increment = isDecimal ? 0.01 : 1;
      const newVal = Math.min(Math.max(value + diff * increment, min), max);
      onChange?.(isDecimal ? parseFloat(newVal.toFixed(2)) : newVal);
    };

  return (
    <div
      className={cn(
        "focus-within:primary group flex items-center rounded-md border p-1 text-base font-semibold ring-primary transition-[box-shadow] focus-within:ring-1",
        className
      )}
    >
      <Button
        variant="ghost2"
        size="icon"
        type="button"
        aria-label="Decrease value"
        className="flex size-7 items-center pl-[.5em] pr-[.325em]"
        disabled={(min != null && value <= min) || disabled}
        onPointerDown={handlePointerDown(-1)}
      >
        <Minus className="size-4" absoluteStrokeWidth strokeWidth={3.5} />
      </Button>
      <div className="relative grid items-center justify-items-center text-center [grid-template-areas:'overlap'] *:[grid-area:overlap]">
        <input
          ref={inputRef}
          className={clsx(
            showCaret ? "caret-primary" : "caret-transparent",
            "spin-hide no-double-click-select w-[3em] bg-transparent text-center font-[inherit] text-transparent outline-none"
          )}
          style={{ fontKerning: "none" }}
          type={isDecimal ? "number" : "text"}
          min={min}
          step={isDecimal ? 0.01 : 1}
          autoComplete="off"
          inputMode={isDecimal ? "decimal" : "numeric"}
          disabled={disabled}
          max={max}
          value={isDecimal ? value.toFixed(2) : value}
          onInput={handleInput}
          aria-label="Number input"
        />
        <NumberFlow
          value={value}
          format={{
            useGrouping: false,
            minimumFractionDigits: isDecimal ? 2 : 0,
            maximumFractionDigits: isDecimal ? 2 : 0,
          }}
          aria-hidden
          animated={animated}
          onAnimationsStart={() => setShowCaret(false)}
          onAnimationsFinish={() => setShowCaret(true)}
          className="pointer-events-none"
          willChange
        />
      </div>
      <Button
        type="button"
        variant="ghost2"
        size="icon"
        aria-label="Increase value"
        className="flex size-7 items-center pl-[.5em] pr-[.325em]"
        disabled={(max != null && value >= max) || disabled}
        onPointerDown={handlePointerDown(1)}
      >
        <Plus className="size-4" absoluteStrokeWidth strokeWidth={3.5} />
      </Button>
    </div>
  );
}
