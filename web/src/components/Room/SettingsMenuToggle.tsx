import * as React from "react";
import { useSettingsToggle } from "../../hooks/useSettingsToggle";

export type SettingsMenuToggleProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const SettingsMenuToggle: (
  props: SettingsMenuToggleProps & React.RefAttributes<HTMLButtonElement>
) => React.ReactNode = React.forwardRef<HTMLButtonElement, SettingsMenuToggleProps>(
  function SettingsMenuToggle(props: SettingsMenuToggleProps, ref) {
    const { mergedProps } = useSettingsToggle({ props });

    return (
      <button
        ref={ref}
        {...mergedProps}
        aria-pressed={
          mergedProps["aria-pressed"] as boolean | "true" | "false" | "mixed" | undefined
        }
      >
        {props.children}
      </button>
    );
  }
);
