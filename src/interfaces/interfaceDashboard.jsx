import React from 'react';
import { Outlet } from 'react-router-dom';
import { MyProSidebarProvider } from "../pages/global/sidebar/sidebarContext";
import Topbar from "../pages/global/Topbar";
import { ColorModeContext, useMode } from "../theme";
import { CssBaseline, ThemeProvider } from "@mui/material";

const InterfaceDashboard = () => {
  const [theme, colorMode] = useMode();
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>  
      <CssBaseline />     
    <MyProSidebarProvider>
    <div style={{ height: "100%", width: "100%" }}>
    <Topbar />
      <main>
      <Outlet/>

      </main>
    </div>
  </MyProSidebarProvider>
  </ThemeProvider>
    </ColorModeContext.Provider>
  
  );
}

export default InterfaceDashboard;
