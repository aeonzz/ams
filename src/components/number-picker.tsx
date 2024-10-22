"use client";

import React, { useState, useEffect, useCallback } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface NumberPickerProps {
  min?: number;
  max?: number;
  step?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
}

export default function NumberPicker({
  min = 0,
  max = 100,
  step = 1,
  defaultValue = min,
  onChange,
}: NumberPickerProps) {
  const [value, setValue] = useState<number>(defaultValue);
  const [error, setError] = useState<string | null>(null);

  const validateValue = useCallback(
    (newValue: number): number => {
      if (newValue < min) return min;
      if (newValue > max) return max;
      return newValue;
    },
    [min, max]
  );

  useEffect(() => {
    setValue(validateValue(defaultValue));
  }, [defaultValue, validateValue]);

  const updateValue = useCallback(
    (newValue: number) => {
      const validatedValue = validateValue(newValue);
      setValue(validatedValue);
      setError(null);
      onChange?.(validatedValue);
    },
    [validateValue, onChange]
  );

  const increment = () => {
    updateValue(value + step);
  };

  const decrement = () => {
    updateValue(value - step);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (isNaN(newValue)) {
      setError("Please enter a valid number");
    } else {
      updateValue(newValue);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      increment();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      decrement();
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={decrement}
          disabled={value <= min}
          aria-label="Decrease value"
        >
          <ChevronDown className="h-4 w-4" />
        </Button>
        <Input
          type="number"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="w-20 text-center"
          min={min}
          max={max}
          step={step}
          aria-label="Number input"
        />
        <Button
          variant="outline"
          size="icon"
          onClick={increment}
          disabled={value >= max}
          aria-label="Increase value"
        >
          <ChevronUp className="h-4 w-4" />
        </Button>
      </div>
      {error && (
        <p className="text-sm text-red-500" role="alert">
          {error}
        </p>
      )}
      {(value === min || value === max) && (
        <p className="text-sm text-yellow-500" role="alert">
          {value === min ? "Minimum" : "Maximum"} value reached
        </p>
      )}
    </div>
  );
}
