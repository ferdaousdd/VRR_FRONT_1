import { ColorModeContext, useMode } from "./theme";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { Routes, Route,Navigate } from "react-router-dom";
import { MyProSidebarProvider } from "./pages/global/sidebar/sidebarContext";
import Topbar from "./pages/global/Topbar";
import { useSelector } from "react-redux";
import ResetPassword from "./pages/RestPassword/ResetPassword";
import 'bootstrap/dist/css/bootstrap.min.css';
import History from "./pages/History";
import InterfaceDashboard from "./interfaces/interfaceDashboard";
import InterfaceSendEmail from "./interfaces/interfaceSendEmail";
import InterfaceLogin from "./interfaces/interfaceLogin";
import Dashboard from "./pages/dashboard";
import Accounts from "./pages/account";
import jwt_decode from 'jwt-decode';
import Bar from "./pages/bar";
import { useEffect } from 'react';
import Pie from "./pages/pie";
import { getToken, storeToken,removeToken } from './services/LocalStorageService';
import { useNavigate } from 'react-router-dom';
// import Team from "./pages/team" ;
import Contacts from "./pages/contacts";
import Form from "./pages/form";
// import Calendar from "./pages/calendar";
// import Bar from "./pages/bar";
import Line from "./pages/line";
//import Pie from "./pages/pie";
// import FAQ from "./pages/faq"; 
import Geography from "./pages/geography";
import { HelmetProvider } from "react-helmet-async";
const isTokenExpired = (token) => {
  const decodedToken = jwt_decode(token);
  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime;
};
const App = () => {
  const { access_token } = useSelector(state => state.auth)
  useEffect(() => {

    const redirectToLogin = () => {
      console.log("bbbbbbbbbbbbbbbbb")

      if (access_token && isTokenExpired(access_token)) {
        removeToken()
  navigate('/')      }
      // return null;
    };
    redirectToLogin();
  }, [access_token]);
  // call checkTokenExpiration() every 5 minutes
  const navigate = useNavigate()

  const redirectToLogin = () => {
    if (access_token && isTokenExpired(access_token)) {
      console.log("aaaaaaaaaaaaaaaaaaaa")
      removeToken()
      navigate('/')
    }
    // return null;
  };
  
  
  // setInterval(redirectToLogin, 2 * 60 * 1000);
  return (

  
<HelmetProvider>


<Routes>

        <Route path="/Dashboard" element={access_token ? <InterfaceDashboard /> : <Navigate to="/" />} >
          <Route index exact element={<Dashboard />} /> 
          <Route path="/Dashboard/form" element={<Form />} />
          <Route path="/Dashboard/contacts" element={<Contacts />} />
          <Route path="/Dashboard/History" element={<History />} />
          <Route path="/Dashboard/line" element={<Line />} />
          <Route path="/Dashboard/geography" element={<Geography />} />
          <Route path="/Dashboard/profile" element={<Accounts />} />
          <Route path="/Dashboard/pie" element={<Pie />} />
          <Route path="/Dashboard/bar" element={<Bar />} />
        </Route>

        <Route path="/" element={!access_token || isTokenExpired(access_token) ? <InterfaceLogin />  : <Navigate to="/Dashboard" />} />
        <Route path="/sendpasswordresetemail" element={<InterfaceSendEmail/>} />
        <Route path="api/user/reset/:id/:token" element={<ResetPassword />} />
        <Route path="*" element={<h1>Error 404 Page not found !!</h1>} />

</Routes>
</HelmetProvider>

    
  );
};

export default App;


