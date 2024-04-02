// import NoSsr from "@mui/base/NoSsr";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import React from "react";
import LoadingScreen from "../component/Loading/Loading";
import NoSsr from "@material-ui/core/NoSsr";
import { primary, secondary } from "./color";

declare module "@mui/material/styles" {
  //   interface Theme extends CustomTheme {}
  //   interface ThemeOptions extends CustomTheme {}
}

const theme = createTheme({
  palette: {
    primary: {
      main: primary["default"],
    },
    secondary: {
      main: secondary["default"],
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontSize: "16px",
          fontWeight: "400",
          lineHeight: "18.75px",
          textAlign: "left",
          borderRadius: "8px",
          padding: "8px 16px",
        },
      },
    },
  },
});

export default function AppThemeProvider(props: { children: React.ReactNode }) {
  const { children } = props;

  return (
    <NoSsr fallback={<LoadingScreen isLoading />}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles
          styles={{
            body: {
              minHeight: "100vh",
              fontFamily: "Roboto",
            },
          }}
        />
        {children}
      </ThemeProvider>
    </NoSsr>
  );
}
