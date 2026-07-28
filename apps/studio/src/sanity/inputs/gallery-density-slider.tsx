import { forwardRef, useCallback, useId, type ChangeEvent } from "react";

import {
  PatchEvent,
  set,
  unset,
  type NumberInputProps,
  type NumberSchemaType,
} from "sanity";

type GalleryDensitySliderProps = NumberInputProps<NumberSchemaType>;

export const GalleryDensitySlider = forwardRef<
  HTMLInputElement,
  GalleryDensitySliderProps
>(function GalleryDensitySlider(props, ref) {
  const { value, readOnly, onChange } = props;
  const inputId = useId();
  const currentValue =
    typeof value === "number" ? Math.min(8, Math.max(1, Math.round(value))) : 3;

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = Number(event.currentTarget.value);
      onChange(
        PatchEvent.from(Number.isFinite(nextValue) ? set(nextValue) : unset()),
      );
    },
    [onChange],
  );

  return (
    <div style={{ display: "grid", gap: 12, paddingBlock: 4 }}>
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <label htmlFor={inputId} style={{ fontSize: 14, fontWeight: 600 }}>
          Image size
        </label>
        <output
          htmlFor={inputId}
          style={{
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 600,
            padding: "4px 8px",
          }}
        >
          {currentValue} / 8
        </output>
      </div>
      <input
        id={inputId}
        ref={ref}
        type="range"
        min={1}
        max={8}
        step={1}
        value={currentValue}
        onChange={handleChange}
        disabled={readOnly}
        readOnly={readOnly}
        aria-valuetext={`Density ${currentValue} of 8`}
        style={{ cursor: readOnly ? "not-allowed" : "pointer", width: "100%" }}
      />
      <div
        style={{
          display: "flex",
          fontSize: 12,
          justifyContent: "space-between",
          opacity: 0.65,
        }}
      >
        <span>Large</span>
        <span>Dense</span>
      </div>
    </div>
  );
});
