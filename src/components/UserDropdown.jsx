// ** React Imports
import { useState, Fragment } from 'react'
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";

// ** Next Import

// ** MUI Imports
import Box from '@mui/material/Box'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import MuiMenu from '@mui/material/Menu'

// ** Icons Imports
import CogOutline from 'mdi-material-ui/CogOutline'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import EmailOutline from 'mdi-material-ui/EmailOutline'
import LogoutVariant from 'mdi-material-ui/LogoutVariant'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import MessageOutline from 'mdi-material-ui/MessageOutline'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import { useDispatch } from 'react-redux';
import { useGetLoggedUserQuery } from '../services/userAuthApi';
import { useTheme } from "@mui/material";
import { tokens } from '../theme';
import { getToken, removeToken } from '../services/LocalStorageService';
import { setUserInfo, unsetUserInfo } from '../features/userSlice';
import { unSetUserToken } from '../features/authSlice';
import { useEffect} from 'react';



// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: '0 0 0 2px ${theme.palette.background.paper}'
}))

const UserDropdown = () => {
    // aaaaaa
    const handleLogout = () => {
      dispatch(unsetUserInfo({ username: "", email: "" }))
      dispatch(unSetUserToken({ access_token: null }))
      removeToken()
      navigate('/')
    }

    
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { access_token } = getToken()
    // const { data, isSuccess } = useGetLoggedUserQuery(access_token)
    const [userData, setUserData] = useState({
        email: "",
        username: "",
        image:"",
  })
  // console.log(userData.image)
  useEffect(() => {

    const fetchUserData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/user/profile/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${access_token}`
          }
        });
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    }
    console.log(userData)

  
    fetchUserData();
  }, [access_token]);
  
    // Store User Data in Local State
    // useEffect(() => {
    //   if (data && isSuccess) {
    //     setUserData({
    //       email: data.email,
    //       username: data.username,
    //       image:data.image,

    //     })
    //   }
    // }, [data, isSuccess])
  
    // // Store User Data in Redux Store
    // useEffect(() => {
    //   if (data && isSuccess) {
    //     dispatch(setUserInfo({
    //       email: data.email,
    //       username: data.username,
    //       image:data.image,
    //     }))
    //   }
    // }, [data, isSuccess, dispatch])



    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    // ** Styled Menu component
  const Menu = styled(MuiMenu)(({ }) => ({
    '& .MuiMenu-list': {
      backgroundColor:colors.primary[400],
    }
  }))
  
  // ** States
  const [anchorEl, setAnchorEl] = useState(null)

  // ** Hooks
  const handleDropdownProfile = event =>{
    navigate('/Dashboard/profile')
    setAnchorEl(null)
  }
  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/user/profile/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization':`Bearer ${access_token}`
          }
        });
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.log(error);
      }
    }
    console.log(userData)

  
    fetchUserData();
  }

  const handleDropdownClose = url => {
    // if (url) {
    //   router.push(url)
    // }
    setAnchorEl(null)
  }

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      fontSize: '1.375rem',
      color: 'text.secondary'
    },
   
  }
  const hoverStyles = {
    '&:hover': {
      color: colors.blueAccent[500],

      '& svg': {
        color: colors.blueAccent[500],
      },
    },
    
  };

  return (

    <Fragment>
   {/* <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'> */}
        <PersonOutlinedIcon onClick={handleDropdownOpen} />
      {/* </IconButton> */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ 
          '& .MuiMenu-paper':
           { width: 230, marginTop: 4 },
     
           }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
              {/* <Avatar alt='John Doe' key={userData.id} src={userData.image}sx={{ width: '2.5rem', height: '2.5rem' }} /> */}
              <Avatar key={userData.id} src={`http://localhost:8000${userData.image}`} alt={userData.username} sx={{ width: '2.5rem', height: '2.5rem' }} />
              {/* <img  key={userData.id} src={userData.image} alt="" /> */}

            </Badge>
            <Box sx={{ display: 'flex', marginLeft: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600 }}>{userData.username}</Typography>
              {/* <Typography variant='body2' sx={{ fontSize: '0.8rem', color: 'text.disabled' }}>
                Admin
              </Typography> */}
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: 0, mb: 1 }} />
        <MenuItem sx={{ backgroundColor: "transparent !important",  p: 0 }}  onClick={() =>handleDropdownProfile() } 
>
          <Box  sx={{ ...hoverStyles, ...styles }}>
            <AccountOutline sx={{  marginRight: 2 }} />
              Profile
          </Box>
        </MenuItem>
        {/* <MenuItem sx={{ backgroundColor: "transparent !important", p: 0 }} onClick={() => handleDropdownClose()}>
          <Box  sx={{  ...hoverStyles , ...styles }}>
            <EmailOutline sx={{ ...hoverStyles , marginRight: 2 }} />
            Inbox
          </Box>
        </MenuItem> */}
        {/* <MenuItem sx={{  backgroundColor: "transparent !important", p: 0 }} onClick={() => handleDropdownClose()}>
          <Box  sx={{  ...hoverStyles , ...styles }}>
            <MessageOutline sx={{...hoverStyles , marginRight: 2 }} />
            Chat
          </Box>
        </MenuItem> */}
        <Divider />
        {/* <MenuItem sx={{ backgroundColor: "transparent !important",  p: 0 }} onClick={() => handleDropdownClose()}>
          <Box  sx={{  ...hoverStyles , ...styles }}>
            <CogOutline sx={{ ...hoverStyles , marginRight: 2 }} />
            Settings
          </Box>
        </MenuItem> */}
        {/* <MenuItem sx={{ backgroundColor: "transparent !important", p: 0 }} onClick={() => handleDropdownClose()}>
          <Box sx={{  ...hoverStyles , ...styles }}>
            <CurrencyUsd sx={{  ...hoverStyles ,marginRight: 2 }} />
            Pricing
          </Box>
        </MenuItem> */}
        {/* <MenuItem sx={{backgroundColor: "transparent !important",  p: 0 }} onClick={() => handleDropdownClose()}>
          <Box  sx={{  ...hoverStyles , ...styles }}>
            <HelpCircleOutline sx={{ ...hoverStyles , marginRight: 2 }} />
            FAQ
          </Box>
        </MenuItem> */}
        {/* <Divider /> */}
        <MenuItem sx={{  ...hoverStyles ,backgroundColor: "transparent !important", py: 2 }} onClick={() => handleLogout()}>
          <LogoutVariant sx={{  marginRight: 2, fontSize: '1.375rem', color: 'text.secondary' }} />
          Logout
        </MenuItem>
      </Menu>
    </Fragment>
  )
}

export default UserDropdown