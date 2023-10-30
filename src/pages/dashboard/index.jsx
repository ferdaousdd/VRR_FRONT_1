import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import React, { useRef } from 'react';
import { tokens } from "../../theme";
import Grid from "@mui/material/Unstable_Grid2";
import InvertColorsIcon from '@mui/icons-material/InvertColors';
import Header from "../../components/Header";
import StatBox from "../../components/StatBox";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import TrafficIcon from "@mui/icons-material/Traffic";
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import { Helmet} from "react-helmet-async";
import GeographyDash  from "../../components/GeographyDash";
import LineChartDash from "../../components/LineChartDash";
import { useGetLoggedUserQuery } from '../../services/userAuthApi';
import { getToken, removeToken } from '../../services/LocalStorageService';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setUserInfo, unsetUserInfo } from '../../features/userSlice';
import { useSelector } from 'react-redux';
import CloudIcon from '@mui/icons-material/Cloud';
import TireRepairIcon from '@mui/icons-material/TireRepair';
import { Form, Col } from 'react-bootstrap';
import Pie from "../../components/PieChart";


const Dashboard = () => {
  const [selectedPoint, setSelectedPoint] = useState("");
  const [selectedSegment, setselectedSegment] = useState("");

  const [users, setUsers] = useState([]);
  const theme = useTheme();
  const smScreen = useMediaQuery(theme.breakpoints.up("sm"));
  const colors = tokens(theme.palette.mode);
  const dispatch = useDispatch()
  const rows = [];
  const [lines, setLines] = useState([]);

  const [segmentsData, setSegmentsData] = useState([]);
  const [WeatherData, setWeatherData] = useState([]);

  const { access_token } = getToken()
  const { email, name,is_admin } = useSelector(state => state.user);
  const { data, isSuccess } = useGetLoggedUserQuery(access_token)
  // Store User Data in Redux Store
  useEffect(() => {
    if (data && isSuccess) {
      dispatch(setUserInfo({
        email: data.email,
        name: data.name,
        is_admin: data.is_admin,
      }))

    }
  }, [data, isSuccess, dispatch])

  const row = [
    { id: 1, name: "Zone 1", noeud:"noeud 1" },
    { id: 2, name: "Zone 2", noeud: "noeud 2"},
    { id: 3, name: "Zone 3", noeud: "noeud 3" },
    // Ajoutez d'autres lignes de données fictives ici
  ];

    // Store User Data in Local State
    // Store User Data in Redux Store
  useEffect(() => {

      const fetchUserData = async () => {
        try {
          const response = await fetch('http://127.0.0.1:8000/api/user/All_user/', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization':`Bearer ${access_token}`
            }
  
          });
          const data = await response.json();
          setUsers(data);
        } catch (error) {
          console.log(error);
        }
      }
      
      // console.log(userInfo);
  
      fetchUserData();
    }, []);    




    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const response = await fetch("http://127.0.0.1:8000/api/user/linestrings/", {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          setLines(data);
        } catch (error) {
          console.log(error);
        }
      };
  
      fetchUserData();
    }, []);

    const handlesegmentChange = (event) => {
      const selectedId = event.target.value;
      setselectedSegment(selectedId);
      const fetchUserData = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/user/parametre/${selectedId}/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          setWeatherData(data);
        } catch (error) {
          console.log(error);
          setWeatherData([])
        }
      };
  
      fetchUserData();
      // setSelectedPoint(selectedId);
      // updateFeatureCoordinates(selectedId)
      // setData([])
  
  
    };


    const handlePointChange = (event) => {
      const selectedId = event.target.value;
      setSelectedPoint(selectedId);
      const fetchUserData = async () => {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/user/parametreweather/${selectedId}/`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          });
          const data = await response.json();
          setSegmentsData(data);

        } catch (error) {
          console.log(error);
          setSegmentsData([]);
          setWeatherData([])

        }
      };
  
      fetchUserData();
      // updateFeatureCoordinates(selectedId)
      // setData([])
      console.log(segmentsData)
  
    };
  


    useEffect(() => {
      if (data && isSuccess) {
        dispatch(setUserInfo({
          email: data.email,
          name: data.name,
          admin:data.is_admin

        }))
      }
    }, [data, isSuccess, dispatch])
  const toast = useRef(null);


  for (let i = 0; i < users.length; i++) {
    rows.push({
      id: users[i].id,
      image:users[i].image,
      first_name: users[i].first_name,
      last_name: users[i].last_name,
      username: users[i].username,
      email: users[i].email,
      Phone_Number: users[i].phone_number,
      Adress: users[i].address,
    });
  }
  console.log(WeatherData)
  
  return (
    
  <>
      <Helmet>
        <title> Dashboard </title>
        <link rel="canonical" href="https://www.tacobell.com/" />
      </Helmet>
      
      <Box m="20px">
        {/* HEADER */}
    
        <Box
          display={smScreen ? "flex" : "block"}
          flexDirection={smScreen ? "row" : "column"}
          justifyContent={smScreen ? "space-between" : "start"}
          alignItems={smScreen ? "center" : "start"}
          m="10px 0"
        >
          <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
    
        </Box>
      <div className="row">
    <div className="col-md-6 mb-3" >  
      <Form.Group style={{ color: colors.grey[100]}}>
        <Form.Label  style={{ color: colors.greenAccent[400]}} >Select Pipes:</Form.Label>
        <Form.Select value={selectedPoint} onChange={handlePointChange}>
          <option value="">Select a line</option>
          {lines.map((line) => (
            <option key={line.id} value={line.id}>
              {line.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </div>
    <div className="col-md-6">
      <Form.Group>
        <Form.Label style={{ color: colors.greenAccent[400]}}>Select Zones:</Form.Label>
        <Form.Select value={selectedSegment} onChange={handlesegmentChange}>
          <option value="">Select a segment</option>
          {segmentsData.map((line) => (
            <option key={line.id} value={line.id}>
              {line.name}
            </option>
          ))}
        </Form.Select>
      </Form.Group>
    </div>
    </div>

        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
    
        <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
            <Box
              width="100%"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={WeatherData ? <>{WeatherData.temperature} °C</> : <>Chargement...</>}
                subtitle="Temprature" 
              
                icon={
                  <DeviceThermostatIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "30px" }}
                  />
                }
              
              />
            </Box>
          </Grid>
    
          <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
            <Box
              width="100%"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              
              <StatBox
                title={WeatherData ? <>{WeatherData.weather} </> : <>Chargement...</>}
                subtitle="weather"
                icon={
                  <CloudIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "30px" }}
                  />
                }
              />
            </Box>
          </Grid>
          <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
            <Box
              width="100%"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={WeatherData ? <>{WeatherData.humidity} </> : <>Chargement...</>}
                subtitle="Humidity"
            
                icon={
                  <InvertColorsIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "30px" }}
                  />
                }
              />
            </Box>
          </Grid>
          <Grid xs={12} sm={12} md={6} lg={3} xl={3}>
            <Box
              width="100%"
              backgroundColor={colors.primary[400]}
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <StatBox
                title={WeatherData ? <>{WeatherData.pressure} </> : <>Chargement...</>}
                subtitle="Pressure"
                icon={
                  <TireRepairIcon
                    sx={{ color: colors.greenAccent[600], fontSize: "30px" }}
                  />
                }
              />
            </Box>
          </Grid>

          <Grid
            xs={12}
            sm={12}
            md={8}
            lg={8}
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
        
            
            {/* <Grid xs={12} sm={12} md={6}>
              <Box backgroundColor={colors.primary[400]} p="30px">
                <Typography variant="h5" fontWeight="600">
                  Campaign
                </Typography>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="center"
                  mt="25px"
                >
                  {/* <ProgressCircle size="125" /> */}
                  {/* <Typography
                    variant="h5"
                    color={colors.greenAccent[500]}
                    sx={{ mt: "15px" }}
                  >
                    $48,352 revenue generated
                  </Typography>
                  <Typography>
                    Includes extra misc expenditures and costs
                  </Typography> */}
                {/* </Box> */}
              {/* </Box> */}
            {/* </Grid>  */}
    
    
    
            <Grid xs={12} sm={12} md={12}>
              <Box backgroundColor={colors.primary[400]} m="25px 0 0 0">
                <Typography
                  variant="h5"
                  fontWeight="600"
                  color={colors.grey[100]}
                  sx={{ padding: "30px 30px 0 30px" }}
                >
                  LineChart
                </Typography>
                <Box height="477px">
                <LineChartDash /> 

                </Box>
              </Box>
          
            </Grid>
    
          </Grid>
    
          <Grid xs={12} sm={12} md={4} lg={4} xl={4}>
          
            
                
                    <Box>
                    
                    <Pie />


                    </Box>
                
            
            <Box
              backgroundColor={colors.primary[400]}
              maxHeight="34vh"
              overflow="auto"
              m="25px 0 0 0"
            >
        
            
            </Box>
          </Grid>
          <Grid xs={12} sm={12} md={12}>
              <Box backgroundColor={colors.primary[400]}>
              
                <Box height="400px" mt="22px">
                 <GeographyDash /> 
                </Box>
              </Box>
          
            </Grid>
        {/* GRID & CHARTS */}
      </Grid>
      </Box>
  </>






  );
};

export default Dashboard;
