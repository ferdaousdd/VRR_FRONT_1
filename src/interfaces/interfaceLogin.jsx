import React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import {CircularProgress,Alert } from '@mui/material';
import { getToken, storeToken } from '../services/LocalStorageService';
import { setUserToken } from '../features/authSlice';
import { NavLink, useNavigate } from 'react-router-dom';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { Helmet } from "react-helmet-async";
import { useEffect, useState } from 'react';
import { useLoginUserMutation } from '../services/userAuthApi';
import { useDispatch } from 'react-redux';



const Login=()=>{

  const [loginUser, { isLoading }] = useLoginUserMutation()
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const [server_error, setServerError] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      email: data.get('email'),
      password: data.get('password'),
    }
    const res = await loginUser(actualData)
    if (res.error) {
      // console.log(typeof (res.error.data.errors))
      // console.log(res.error.data.errors)
      setServerError(res.error.data.errors)
    }
    if (res.data) {
      // console.log(typeof (res.data))
      // console.log(res.data)
      storeToken(res.data.token)
      let { access_token } = getToken()
      dispatch(setUserToken({ access_token: access_token }))
      navigate('/Dashboard')
    }
  }
  let { access_token } = getToken()
  useEffect(() => {
    dispatch(setUserToken({ access_token: access_token }))
  }, [access_token, dispatch])


  function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
    
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}




  return   <>

  

    {server_error.non_field_errors ? console.log(server_error.non_field_errors[0]) : ""}
    {server_error.email ? console.log(server_error.email[0]) : ""}
    {server_error.password ? console.log(server_error.password[0]) : ""}
    
<Helmet>
        <title> Login </title>
        <link rel="canonical" href="https://www.tacobell.com/" />
</Helmet>





        <Grid container  component="main" sx={{ height: '100vh' }}>
          <CssBaseline />
          <Grid
          className="grid-with-background"
            item
            xs={false}
            // sm={{flexDirection: 'column'}}
            md={4}
            sx={{
          
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />

          <Grid item xs={12} sm={12} md={8} component={Paper} elevation={4}>
            <Box
              sx={{
                my: 8,
                mx: 4,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >

              <Avatar sx={{ m: 1,bgcolor:'#1976d2' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5" color="primary">
                Sign in 
              </Typography>
              
              <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }} >
                <TextField
                  helperText="Please specify the Email"
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />
                                



                <TextField
                helperText="Please specify the Password"

                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                />


                <FormControlLabel
                  control={<Checkbox value="remember"  />}
                  label="Remember me"
                />
                {/* <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Sign In
                </Button> */}
  <Box textAlign='center'>
        {isLoading ? <CircularProgress /> : <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}>  Sign In</Button>}
      </Box>

                <Grid container>
                  <Grid item xs>
                        <NavLink to='/sendpasswordresetemail' >Forgot Password ?</NavLink>




                        {server_error.non_field_errors ? <Alert severity='error'>{server_error.non_field_errors[0]}</Alert> : ''}
                     
                    
                  </Grid>
          
        
                </Grid>


                <Grid container marginBottom={1}>
                  <Grid item xs>



                  {server_error.email ? <Alert severity='error'>{server_error.email[0]}</Alert> : ""}
                     
                    
                  </Grid>
          
                  {/* <Grid item>
                    <Link href="#" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid> */}
                </Grid>

                <Grid container>
                  <Grid item xs>



                  {server_error.password ? <Alert severity='error'>{server_error.password[0]}</Alert> : ""}
                     
                    
                  </Grid>
          
                  {/* <Grid item>
                    <Link href="#" variant="body2">
                      {"Don't have an account? Sign Up"}
                    </Link>
                  </Grid> */}
                </Grid>


                <Copyright sx={{ mt: 5 }} />
              </Box>
              
            </Box>
          </Grid>

          
        </Grid>

    {/* {server_error.non_field_errors ? console.log(server_error.non_field_errors[0]) : ""}
    {server_error.email ? console.log(server_error.email[0]) : ""}
    {server_error.password ? console.log(server_error.password[0]) : ""}
    <Box component='form' noValidate sx={{ mt: 1 }} id='login-form' onSubmit={handleSubmit}>
      <TextField margin='normal' required fullWidth id='email' name='email' label='Email Address' />
      {server_error.email ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.email[0]}</Typography> : ""}
      <TextField margin='normal' required fullWidth id='password' name='password' label='Password' type='password' />
      {server_error.password ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.password[0]}</Typography> : ""}
      <Box textAlign='center'>
        {isLoading ? <CircularProgress /> : <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}>Login</Button>}
      </Box>
      <NavLink to='/sendpasswordresetemail' >Forgot Password ?</NavLink>
      {server_error.non_field_errors ? <Alert severity='error'>{server_error.non_field_errors[0]}</Alert> : ''}
    </Box> */}
    </>;
  
};
    
    

export default Login;
