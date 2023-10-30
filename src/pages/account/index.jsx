import {
  Box, Container, Divider, Stack, Typography,
  Avatar,
  Unstable_Grid2 as Grid,
  Button,
  Card,
  CardActions,
  CardContent,
  TextField,
  Alert,

  CardHeader,
} from '@mui/material';
// import { AccountProfile } from '../sections/account/account-profile';
import AccountProfilePassword from '../sections/account';
import { useUpdateProfileMutation } from '../../services/userAuthApi';
import { useEffect } from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../../services/LocalStorageService';

import { useTheme } from '@mui/material';
import { tokens } from '../../theme';
import React from 'react';
import Header from "../../components/Header";

const Profile = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const { access_token } = getToken()
  // const { data, isSuccess } = useGetLoggedUserQuery(access_token)
  const [userData, setUserData] = useState({
    email: "",
    username: "",
    image: "",
    address: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  })
  const [editedData, setEditedData] = useState({
    email: "",
    username: "",
    image: "",
    address: "",
    first_name: "",
    last_name: "",
    phone_number: "",
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevState) => ({
        ...prevState,
        [name]: value,
    }));
  };
  // const handleChange = (e) => {
  //   const { name, value } = e.target;
  //   if (e.target.type === 'file') {
  //     setEditedData((prevState) => ({
  //       ...prevState,
  //       image: e.target.files[0],
  //       // ajouter le nom du fichier sans l'URL encodée
  //       image_url: e.target.files[0] ? e.target.files[0].name : '',
  //     }));
  //   } else {
  //     setEditedData((prevState) => ({
  //       ...prevState,
  //       [name]: value,
  //     }));
  //   }
  // };




  const [server_msg, setServerMsg] = useState({})
  const [showAlert, setShowAlert] = useState(false);
  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  setTimeout(() => {
    handleCloseAlert();
  }, 20000);


  const [UpdateProfile, { isLoading }] = useUpdateProfileMutation()
  const [server_error, setServerError] = useState({})


  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const data = new FormData(e.currentTarget);

  //   const actualData = {
  //     email: data.get('email'),
  //     username: data.get('username'),
  //     address:data.get('address'),
  //     first_name:data.get('first_name'),
  //     last_name:data.get('last_name'),
  //     phone_number:data.get('phone_number'),
  //     image:data.get('image')

  //   }   
  //   const newUserData = {
  //     email: actualData.email,
  //     username: actualData.username,
  //     address:actualData.address,
  //     first_name:actualData.first_name,
  //     last_name:actualData.last_name,
  //     phone_number:actualData.phone_number,
  //     image:actualData.image,

  //   };


  //  const res = await UpdateProfile({ actualData , access_token})
  //  if (res.error) {
  //   // console.log(typeof (res.error.data.errors))
  //   // console.log(res.error.data.errors)
  //   setServerError(res.error.data.errors)

  // }
  // if (res.data) {
  //   // console.log(typeof (res.data))
  //   // console.log(res.data)
  //   setServerError({})
  //   setServerMsg(res.data)
  //   setShowAlert(true)
  //   setUserData(newUserData);



  // }

  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);

    // Créer un nouvel objet avec les données du formulaire, y compris l'image
    const actualData = {
      email: data.get('email'),
      username: data.get('username'),
      address: data.get('address'),
      first_name: data.get('first_name'),
      last_name: data.get('last_name'),
      phone_number: data.get('phone_number'),
    };
    actualData.image = data.get('image');

    // Ajouter l'image à l'objet FormData
    const formData = new FormData();
    Object.keys(actualData).forEach((key) => {
      formData.append(key, actualData[key]);
    });
    formData.append('image', data.get('image'));

    const newUserData = {
      email: actualData.email,
      username: actualData.username,
      address: actualData.address,
      first_name: actualData.first_name,
      last_name: actualData.last_name,
      phone_number: actualData.phone_number,
      image: actualData.image,
    };

    const res = await UpdateProfile({ actualData: formData, access_token });

    if (res.error) {
      setServerError(res.error.data.errors);
      console.log(actualData)
    }
    if (res.data) {
      setServerError({});
      setServerMsg(res.data);
      setShowAlert(true);
      console.log(actualData)

      setUserData(newUserData);
      console.log(userData.image)
    }
  };



  useEffect(() => {

    const fetchUserData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/user/profile/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${access_token}`
          }
        });
        const data = await response.json();
        setUserData(data);
        setEditedData(data);
      } catch (error) {
        console.log(error);
      }
    }

    fetchUserData();
  }, [access_token, userData.image]);





  return (


    <Box m="20px">
      <Header
        title="Users Informations"
        subtitle="welcome to you users informations"
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 1
        }}
      >

        
        <Container maxWidth="lg">
          <Stack spacing={3}>

            <div>
            <form
                    autoComplete="off"
                    noValidate
                    onSubmit={handleSubmit}
                  >
              <Grid
                container
                spacing={3}
              >

  
<Grid
                      xs={12}
                      md={6}
                      lg={4}
                    >
                      {/* <AccountProfile UserData={userData} /> */}
                      <Card style={{ backgroundColor: colors.primary[400] }}>
                        <CardContent>
                          <Box
                            sx={{
                              alignItems: 'center',
                              display: 'flex',
                              flexDirection: 'column'
                            }}
                          >
                            <Avatar
                              key={userData.id}
                              src={`http://localhost:8000${userData.image}`}
                              alt={userData.username}
                              sx={{
                                height: 230,
                                mb: 2,
                                width: 230
                              }}


                            />
                            <Typography
                              gutterBottom
                              variant="h5"
                            >
                              {userData.username}
                            </Typography>
                            <Typography
                              color="text.secondary"
                              variant="body2"
                            >
                              {userData.address}
                            </Typography>
                            <Typography
                              color="text.secondary"
                              variant="body2"
                            >
                            </Typography>
                          </Box>
                        </CardContent>
                        <div style={{ marginTop: 6 }}>
                          <Divider />
                        </div>
                        <CardActions>
                          <Button style={{
                            backgroundColor: colors.greenAccent[600]
                          }} variant="contained" component="label" fullWidth>
                            Upload picture
                            <input hidden name='image' src={`http://localhost:8000${userData.image}`} id='image' defaultValue={userData.image}  type="file" onChange={handleChange}
                            />
                          </Button>


                        </CardActions>
                      </Card>
                    </Grid>
                <Grid
                  xs={12}
                  md={6}
                  lg={8}
                >

            

                    <Card style={{ backgroundColor: colors.primary[400] }}
                    >
                      <CardHeader
                        subheader="The Profile can be edited"
                        title="Profile"
                      />
                      <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', maxWidth: 600, mx: 4 }}>

                        <CardContent sx={{ pt: 0 }}>
                          <Box sx={{ m: -1.5 }}>
                            {showAlert && server_msg.msg ? <Alert severity='success' onClose={handleCloseAlert}>{server_msg.msg}  </Alert> : ''}

                            <Grid
                              container
                              spacing={3}
                            >
                              <Grid
                                xs={12}
                                md={6}
                              >

                                <TextField
                                  variant="outlined"
                                  fullWidth
                                  label="First name"
                                  name="first_name"
                                  value={editedData.first_name}
                                  onChange={handleChange}
                                />
                              </Grid>

                              <Grid
                                xs={12}
                                md={6}
                              >
                                <TextField
                                  fullWidth
                                  label="Last name"
                                  name="last_name"
                                  value={editedData.last_name}
                                  onChange={handleChange}
                                />
                              </Grid>
                              <Grid
                                xs={12}
                                md={6}
                              >

                                <TextField
                                  fullWidth
                                  label="address"
                                  name="address"
                                  value={editedData.address}
                                  onChange={handleChange}
                                  required

                                />

                              </Grid>
                              <Grid
                                xs={12}
                                md={6}
                              >
                                <TextField
                                  fullWidth
                                  label="Phone Number"
                                  name="phone_number"
                                  type="number"
                                  value={editedData.phone_number}
                                  onChange={handleChange}
                                />
                                {server_error.phone_number ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.phone_number[0]}</Typography> : ""}
                              </Grid>
                              <Grid
                                xs={12}
                                md={6}
                              >
                                <TextField
                                  fullWidth
                                  label="Email address"
                                  name="email"
                                  value={editedData.email}
                                  onChange={handleChange}
                                  required
                                />
                                {server_error.email ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.email[0]}</Typography> : ""}



                              </Grid>

                              <Grid
                                xs={12}
                                md={6}
                              >

                                <TextField
                                  fullWidth
                                  label="username"
                                  name="username"
                                  value={editedData.username}
                                  onChange={handleChange}
                                  required

                                />
                                {server_error.username ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.username[0]}</Typography> : ""}

                              </Grid>





                            </Grid>
                          </Box>
                        </CardContent>
                      </Box>


                      <Divider />
                      <CardActions sx={{ justifyContent: 'flex-end' }}>
                        <Button style={{
                          backgroundColor: colors.greenAccent[600]
                        }} variant="contained" type='submit'>
                          Save details

                        </Button>
                      </CardActions>


                    </Card>

                  

                </Grid>


              

              </Grid>
              </form>

            </div>
          </Stack>

          <div style={{ marginTop: 10 }}>
            <Divider />
          </div>


          <div>
            <Grid marginTop={2}>
              <AccountProfilePassword UserData={userData} />
            </Grid>
          </div>

        </Container>
      </Box>

    </Box>





  );
}

export default Profile;