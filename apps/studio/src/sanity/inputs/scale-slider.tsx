import {
  forwardRef,
  useCallback,
  type ChangeEvent,
  type ForwardedRef,
} from "react";

import {
  PatchEvent,
  set,
  unset,
  type NumberInputProps,
  type NumberSchemaType,
} from "sanity";

type ScaleSliderProps = NumberInputProps<NumberSchemaType>;

interface ScaleSliderConfig {
  label: string;
  minimumLabel: string;
  maximumLabel: string;
}

function ScaleSlider(
  props: ScaleSliderProps,
  ref: ForwardedRef<HTMLInputElement>,
  config: ScaleSliderConfig,
) {
  const { value, readOnly, onChange, elementProps } = props;
  const inputId = elementProps.id;
  const currentValue =
    typeof value === "number" ? Math.min(5, Math.max(1, Math.round(value))) : 3;
  const setInputRef = useCallback(
    (element: HTMLInputElement | null) => {
      elementProps.ref.current = element;

      if (typeof ref === "function") {
        ref(element);
      } else if (ref) {
        ref.current = element;
      }
    },
    [elementProps.ref, ref],
  );

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
    <div
      style={{
        color: "var(--card-fg-color, #111827)",
        display: "grid",
        gap: 12,
        paddingBlock: 4,
      }}
    >
      <div
        style={{
          alignItems: "center",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <output
          htmlFor={inputId}
          style={{
            background: "var(--card-muted-bg-color, rgba(17,24,39,0.08))",
            borderRadius: 999,
            color: "var(--card-muted-fg-color, #6b7280)",
            fontSize: 12,
            fontWeight: 600,
            padding: "4px 8px",
          }}
        >
          {currentValue} / 5
        </output>
      </div>

      <input
        {...elementProps}
        id={inputId}
        ref={setInputRef}
        type="range"
        min={1}
        max={5}
        step={1}
        value={currentValue}
        onChange={handleChange}
        disabled={readOnly || elementProps.readOnly}
        readOnly={readOnly || elementProps.readOnly}
        aria-valuetext={`${config.label} ${currentValue} of 5`}
        style={{
          cursor: readOnly || elementProps.readOnly ? "not-allowed" : "pointer",
          width: "100%",
        }}
      />

      <div
        style={{
          color: "var(--card-muted-fg-color, #6b7280)",
          display: "flex",
          fontSize: 12,
          justifyContent: "space-between",
        }}
      >
        <span>{config.minimumLabel}</span>
        <span>{config.maximumLabel}</span>
      </div>
    </div>
  );
}

export const HeaderSizeSlider = forwardRef<HTMLInputElement, ScaleSliderProps>(
  function HeaderSizeSlider(props, ref) {
    return ScaleSlider(props, ref, {
      label: "Header size",
      minimumLabel: "Compact",
      maximumLabel: "Spacious",
    });
  },
);

export const HeroTitleSizeSlider = forwardRef<
  HTMLInputElement,
  ScaleSliderProps
>(function HeroTitleSizeSlider(props, ref) {
  return ScaleSlider(props, ref, {
    label: "Hero title size",
    minimumLabel: "Smaller",
    maximumLabel: "Larger",
  });
});
