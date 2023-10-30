import { Grid, TextField, Button, Box, Alert, Typography } from "@mui/material";
import { useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import {CircularProgress } from '@mui/material';
import { Helmet } from "react-helmet-async";
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useSendPasswordResetEmailMutation } from "../services/userAuthApi";
const SendPasswordResetEmail = () => {
  const [server_error, setServerError] = useState({})
  const [server_msg, setServerMsg] = useState({})
  const [sendPasswordResetEmail, { isLoading }] = useSendPasswordResetEmailMutation()
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      email: data.get('email'),
    }

    const res = await sendPasswordResetEmail(actualData)
    if (res.error) {
      console.log(typeof (res.error.data.errors))
      console.log(res.error.data.errors)
      setServerMsg({})
      setServerError(res.error.data.errors)
    }
    if (res.data) {
      console.log(typeof (res.data))
      console.log(res.data)
      setServerError({})
      setServerMsg(res.data)
      document.getElementById('password-reset-email-form').reset()
    }
  }

  function Copyright(props) {
    return (
      <Typography variant="body2" color="text.secondary" align="center" {...props}>
        {'Copyright © '}
      
        {new Date().getFullYear()}
        {'.'}
      </Typography>
    );
  }
  return <>
    {server_error.non_field_errors ? console.log(server_error.non_field_errors[0]) : ""}
    {server_error.email ? console.log(server_error.email[0]) : ""}
<Helmet>
        <title> sendPasswordResetEmail </title>
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
              }}>
                  <Avatar sx={{ m: 1,bgcolor:'#1976d2' }}>
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5" color="primary">
              Reset Password
              </Typography>

        {/* <h1>Reset Password</h1> */}


        <Box component='form'  noValidate sx={{ mt: 1.5 }}  onSubmit={handleSubmit}>
  <TextField
                  helperText="Please specify the Email"
                  margin="normal"
                  required
                  style={{width:'600px'}}
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                />   
                     
                  {server_error.email ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.email[0]}</Typography> : ""}
          <Box textAlign='center'>
          {isLoading ? <CircularProgress /> : <Button type='submit' fullWidth variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}> Send</Button>}

            {/* <Button type='submit' variant='contained' sx={{ mt: 3, mb: 2, px: 5 }}>Send</Button> */}
          </Box>

          <Grid container>
                  <Grid item xs>


                  {server_error.non_field_errors ? <Alert severity='error'>{server_error.non_field_errors[0]}</Alert> : ''}


                     
                    
                  </Grid>
          
        
                </Grid>
                <Grid container marginBottom={1}>
                  <Grid item xs>



                  {server_msg.msg ? <Alert severity='success'>{server_msg.msg}</Alert> : ''}
                     
                    
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
    

  </>;
};

export default SendPasswordResetEmail;
