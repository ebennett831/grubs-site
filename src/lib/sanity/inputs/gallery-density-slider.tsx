import { forwardRef, useCallback, useId, type ChangeEvent } from "react";

import { PatchEvent, set, unset, type NumberInputProps, type NumberSchemaType } from "sanity";

type GalleryDensitySliderProps = NumberInputProps<NumberSchemaType>;

export const GalleryDensitySlider = forwardRef<HTMLInputElement, GalleryDensitySliderProps>(
  function GalleryDensitySlider(props, ref) {
    const { value, readOnly, onChange } = props;
    const inputId = useId();
    const currentValue = typeof value === "number" ? value : 2;

    const handleChange = useCallback(
      (event: ChangeEvent<HTMLInputElement>) => {
        const nextValue = Number(event.currentTarget.value);
        onChange(PatchEvent.from(Number.isFinite(nextValue) ? set(nextValue) : unset()));
      },
      [onChange],
    );

    return (
      <div className="space-y-2">
        <label htmlFor={inputId} className="block text-sm font-medium text-black">
          Gallery Density
        </label>
        <input
          id={inputId}
          ref={ref}
          type="range"
          min={1}
          max={8}
          step={1}
          value={currentValue}
          onChange={handleChange}
          readOnly={readOnly}
          className="w-full accent-[var(--color-accent)]"
        />
        <div className="flex items-center justify-between text-xs text-black/60">
          <span>Large</span>
          <span>{currentValue}</span>
          <span>Dense</span>
        </div>
      </div>
    );
  },
);
