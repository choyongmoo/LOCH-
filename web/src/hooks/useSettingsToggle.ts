import { mergeProps } from "@/lib/utils";
import { useLayoutContext } from "@livekit/components-react";
import * as React from "react";

export interface UseSettingsToggleProps {
  props: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

export function useSettingsToggle({ props }: UseSettingsToggleProps) {
  const { dispatch, state } = useLayoutContext().widget;
  const className = "lk-button lk-settings-toggle";

  const mergedProps = React.useMemo(() => {
    return mergeProps(props, {
      className,
      onClick: () => {
        if (dispatch) dispatch({ msg: "toggle_settings" });
      },
      "aria-pressed": state?.showSettings ? "true" : "false",
    });
  }, [props, className, dispatch, state]);

  return { mergedProps };
}
