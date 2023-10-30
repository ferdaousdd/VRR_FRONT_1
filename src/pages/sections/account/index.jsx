import { Box, TextField, Button, Alert, Typography } from '@mui/material';
import { useState } from 'react';
import { useSelector } from 'react-redux';

import { useChangeUserPasswordMutation } from '../../../services/userAuthApi';
import { getToken } from '../../../services/LocalStorageService'
import { Container,Divider, Stack,
  Avatar,
   Unstable_Grid2 as Grid , 
 
Card,
CardActions,
CardContent,
CardHeader,} from '@mui/material';
import { useTheme } from '@mui/material';
import { tokens } from '../../../theme';
const AccountProfilePassword = () => {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [server_error, setServerError] = useState({})
  const [server_msg, setServerMsg] = useState({})
  const [changeUserPassword] = useChangeUserPasswordMutation()
  const { access_token } = getToken()
  const [showAlert, setShowAlert] = useState(false);
  const [passwordData, setpasswordData] = useState({
    password: "",
    password_confirmation: "",
    old_password:"",
  
});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setpasswordData((prevState) => ({
        ...prevState,
        [name]: value,
    }));
  };
  const handleCloseAlert = () => {
    setShowAlert(false);
  };
  setTimeout(() => {
    handleCloseAlert();
  }, 20000);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const actualData = {
      password: data.get('password'),
      password_confirmation: data.get('password_confirmation'),
      old_password: data.get('old_password'),


    }
    const res = await changeUserPassword({ actualData, access_token })
    if (res.error) {

      setServerMsg({})
      setServerError(res.error.data.errors)
      setShowAlert(true)

    }
    if (res.data) {
      
    
      setServerError({})
      setServerMsg(res.data)
      setShowAlert(true)

      console.log('success')
      setpasswordData({})

    }

  };
  // Getting User Data from Redux Store
  const myData = useSelector(state => state.user)
  // console.log("Change Password", myData)

  return <>
    {/* {server_error.non_field_errors ? console.log(server_error.non_field_errors[0]) : ""}
    {server_error.password ? console.log(server_error.password[0]) : ""}
    {server_error.password2 ? console.log(server_error.password2[0]) : ""} */}
          <Grid
              xs={12}
              md={6}
              lg={8}
            >
        <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit}
      > 
       <Card style={{backgroundColor : colors.primary[400]}}>
      <CardHeader
          subheader="The Password can be edited"
          title="Password"
        />  
      
        <Box sx={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap', mx: 4 }}>
        {showAlert && server_error.non_field_errors ? <Alert severity='error' onClose={handleCloseAlert}>{server_error.non_field_errors[0]}</Alert> : ''}
        {showAlert && server_msg.msg ? <Alert severity='success' onClose={handleCloseAlert}>{server_msg.msg}</Alert> : ''}
        
        <CardContent sx={{ pt: 0 }}>
        <Box sx={{ m: -1.5 }}>

      <Grid
              container
              spacing={3}
            >
      <Grid
                xs={12}
                md={4}
              >
        <TextField margin="normal" required fullWidth name="old_password" label="Old Password" type="password" id="old_password"   onChange={handleChange} />
        {server_error.old_password ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.old_password[0]}</Typography> : ""}

      </Grid>
      <Grid
                xs={12}
                md={4}
              >
        <TextField margin="normal" required fullWidth name="password" label="New Password" type="password" id="password"   onChange={handleChange} />
        
        {server_error.password ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }} >{server_error.password[0]}</Typography> : ""}
        </Grid>
        <Grid
                xs={12}
                md={4}
              >
        <TextField margin="normal" required fullWidth name="password_confirmation" label="Confirm Password" type="password" id="password_confirmation" onChange={handleChange} />
        {server_error.password_confirmation ? <Typography style={{ fontSize: 12, color: 'red', paddingLeft: 10 }}>{server_error.password_confirmation[0]}</Typography> : ""}
        </Grid>
        </Grid>
        </Box>
        </CardContent>
        
        <div style={{marginTop:6}}>
        <Divider />
    </div>

        <CardActions sx={{ justifyContent: 'flex-end' }}>
          <Button style={{
                backgroundColor: colors.greenAccent[600]
              }}variant="contained" type='submit'>
            Edit Password

          </Button>
          {/* {server_error.non_field_errors ? <Alert severity='error'>{server_error.non_field_errors[0]} </Alert> : ''} */}
          {/* {server_msg.msg ? <Alert severity='success'>{server_msg.msg}</Alert> : ''} */}
        </CardActions>
      
      </Box>
    </Card>
    </form>
    </Grid>
    



  </>;
};

export default AccountProfilePassword;
