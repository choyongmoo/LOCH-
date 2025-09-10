import { createTheme, CssBaseline, ThemeProvider as MuiThemeProvider } from "@mui/material";
import { useMemo } from "react";
import { colorSchemes, shadows, shape, typography } from "../theme";
import { components } from "../theme/components";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useMemo(
    () =>
      createTheme({
        cssVariables: {
          colorSchemeSelector: "data-mui-color-scheme",
          cssVarPrefix: "template",
        },
        defaultColorScheme: "dark",
        colorSchemes,
        typography,
        shadows,
        shape,
        components,
      }),
    []
  );

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
}
