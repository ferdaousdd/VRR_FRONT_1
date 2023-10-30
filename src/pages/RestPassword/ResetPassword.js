import { Grid, TextField, Button, Box, Alert, Typography } from "@mui/material";
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useResetPasswordMutation } from "../../services/userAuthApi";
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Helmet } from "react-helmet-async";

const ResetPassword = () => {
  const [server_error, setServerError] = useState({})
  const [server_msg, setServerMsg] = useState({})
  const [resetPassword] = useResetPasswordMutation()
  const { id, token } = useParams()
  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const actualData = {
      password: data.get('password'),
      password_confirmation: data.get('password_confirmation'),
    }
    const res = await resetPassword({ actualData, id, token })
    if (res.error) {
      setServerMsg({})
      setServerError(res.error.data.errors)
    }
    if (res.data) {
      setServerError({})
      setServerMsg(res.data)
      document.getElementById('password-reset-form').reset()
      setTimeout(() => {
        navigate("/")
      }, 3000)
    }

  }
  return <>

    
<Helmet>
        <title> Reset Password </title>
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
              Reset Password 
              </Typography>


        <Box component='form' noValidate sx={{ mt: 1 }} id='password-reset-form' onSubmit={handleSubmit}>
          <TextField margin='normal' required fullWidth id='password' name='password' label='New Password' type='password' />
          {server_error.password ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.password[0]}</Typography> : ""}
          <TextField margin='normal' required fullWidth id='password_confirmation' name='password_confirmation' label='Confirm New Password' type='password' />
          {server_error.password_confirmation ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.password_confirmation[0]}</Typography> : ""}
          <Box textAlign='center'>
            <Button type='submit' variant='contained' sx={{ mt: 4, mb: 2, px: 5 }}>Save</Button>
          </Box>
          {server_error.non_field_errors ? <Alert severity='error'>{server_error.non_field_errors[0]}</Alert> : ''}
          {server_msg.msg ? <Alert severity='success'>{server_msg.msg}</Alert> : ''}
        </Box>
      </Box>
    </Grid>
    </Grid>
  </>;
};

export default ResetPassword;
