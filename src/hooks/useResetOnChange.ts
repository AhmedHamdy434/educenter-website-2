import { useEffect, useRef } from "react";

/**
 * Invokes a callback when a tracked value changes, passing the current and previous values.
 * Useful for resetting dependent form fields when a parent field selection changes.
 *
 * @param value The value to watch for changes
 * @param onChange Callback triggered when the value differs from the previous value
 * @param initialValue Optional initial value to avoid false positive triggers on mount
 * @param resetTrigger Optional trigger (e.g. form reset / entity switch) that resets the previous tracker
 */
export function useResetOnChange<T>(
  value: T,
  onChange: (current: T, previous: T) => void,
  initialValue?: T,
  resetTrigger?: unknown
): void {
  const prevRef = useRef<T>(initialValue !== undefined ? initialValue : value);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  });

  useEffect(() => {
    prevRef.current = initialValue !== undefined ? initialValue : value;
  }, [resetTrigger]);

  useEffect(() => {
    const prev = prevRef.current;
    if (value !== prev) {
      prevRef.current = value;
      onChangeRef.current(value, prev);
    }
  }, [value]);
}
