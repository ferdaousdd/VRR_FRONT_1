import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import MuiMenu from '@mui/material/Menu';
import MuiAvatar from '@mui/material/Avatar';
import MuiMenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import PerfectScrollbarComponent from 'react-perfect-scrollbar';
import 'react-perfect-scrollbar/dist/css/styles.css';
import { useTheme } from '@mui/material';
import { tokens } from '../theme';
import { useNavigate } from 'react-router-dom';
import Badge from '@mui/material/Badge';
import { withStyles } from '@mui/styles';

const StyledBadge = withStyles((theme) => ({
  badge: {
    borderRadius: '50%',
    padding: '6px',
    minWidth: 'unset',
    minHeight: 'unset',
  },
}))(Badge);

const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  borderBottom:` 1px solid ${theme.palette.divider}`,
}));

const styles = {
  maxHeight: 349,
  '& .MuiMenuItem-root:last-of-type': {
    border: 0,
  },
};

const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  ...styles,
});

const Avatar = styled(MuiAvatar)({
  width: '2.375rem',
  height: '2.375rem',
  fontSize: '1.125rem',
});

const MenuItemTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  flex: '1 1 100%',
  overflow: 'hidden',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  marginBottom: theme.spacing(0.75),
}));

const MenuItemSubtitle = styled(Typography)({
  flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
});

const NotificationDropdown = () => {
  const navigate = useNavigate();
  const [selectedNotification, setSelectedNotification] = useState(null);

  const [data, setData] = useState([]);
  const [notificationCount, setNotificationCount] = useState();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [anchorEl, setAnchorEl] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/user/notification/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        setData(data);
        setNotificationCount(Math.max(data.filter(notification => !notification.notif.is_read).length, 0));
      } catch (error) {
        console.log(error);
      }
    };

    fetchUserData();
  }, []);
console.log(data)
  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleDropdownClose = () => {
    setAnchorEl(null);
  };
console.log(data)

const handleNotificationClick = (notification) => {
  if (!notification.notif.is_read) {
    // Update the notification status to "read" on the server
    const markNotificationAsRead = async () => {
      try {
        await fetch(`http://127.0.0.1:8000/api/user/notif/${notification.notif.id}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ is_read: true }),
        });
      } catch (error) {
        console.log(error);
      }
    };
    markNotificationAsRead();

    // Update the notification status in the local state
    const updatedData = data.map(item => {
      if (item.notif.id === notification.notif.id) {
        item.notif.is_read = true;
      }
      return item;
    });
    setData(updatedData);
  }
  setSelectedNotification(notification);

     // Decrement the notification count
     setNotificationCount(prevCount => Math.max(prevCount - 1, 0));
     navigate('/Dashboard/geography');
 
};



const handleNotifClick = (notification) => {
  console.log(notification)

console.log(notification.zone[0].id)
  // if (!notification.notif.is_read) {
    // Update the notification status to "read" on the server
    const markNotificationAsRead = async () => {
      try {
        await fetch(`http://127.0.0.1:8000/api/user/zone/${notification.zone[0].id}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ fuite: false }),
        });
      } catch (error) {
        console.log(error);
      }
    };
    markNotificationAsRead();
    const DeleteNotification = async () => {
      try {
        await fetch(`http://127.0.0.1:8000/api/user/noti/${notification.notif.id}/`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.log(error);
      }
    };
    DeleteNotification();
    // Update the notification status in the local state
    setData(data.filter(item => item.notif.id !== notification.notif.id));

    // const updatedData = data.map(item => {
    //   if (item[0] === notification) {
    //     item.notif.is_read = true;
    //   }
    //   return item;
    // });
    // setData(updatedData);
  
  setSelectedNotification(notification);

     // Decrement the notification count
     setNotificationCount(prevCount => Math.max(prevCount - 1, 0));
  
};


function getFormattedDate(date, yesterday) {
  const options = { hour: 'numeric', minute: 'numeric' };

  if (isToday(date)) {
    return 'Today ' + date.toLocaleTimeString(undefined, options);
  } else if (isYesterday(date, yesterday)) {
    return 'Yesterday ' + date.toLocaleTimeString(undefined, options);
  } else {
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString(undefined, options);
  }
}

function isToday(date) {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
}

function isYesterday(date, yesterday) {
  return date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();
}

  return (
    <>
      <IconButton color="inherit" aria-haspopup="true" onClick={handleDropdownOpen} aria-controls="customized-menu">
      <StyledBadge badgeContent={notificationCount} color="primary" >
      <NotificationsOutlinedIcon />
      </StyledBadge>
      
      </IconButton>
      <MuiMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            width: 380,
            overflow: 'hidden',
            marginTop: theme.spacing(4),
            [theme.breakpoints.down('sm')]: {
              width: '100%',
            },
          },
        }}
        MenuListProps={{
          sx: {
            padding: 0,
            backgroundColor: colors.primary[400],
          },
        }}
      >
        <MenuItem disableRipple>
          <Box sx={{ color: colors.greenAccent[600], display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography sx={{ fontWeight: 600 }}>Notifications</Typography>
            <Chip
              size="small"
              label={`${notificationCount} New`}
              style={{ backgroundColor: colors.greenAccent[600] }}
              sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500, borderRadius: '10px' }}
            />
          </Box>
        </MenuItem>







        {data.length > 0 && (
  <PerfectScrollbar>
    {data.map((notification, index) => {
      const notificationDate = new Date(notification.date);
      const currentDate = new Date();
      const yesterday = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate() - 1);
      const formattedDate = getFormattedDate(notificationDate, yesterday);

      return (
          <MenuItem
            onClick={() => handleNotificationClick(notification)}
            key={index}
            sx={{
              backgroundColor: notification.notif.is_read ? 'transparent' : colors.primary[800],
              position: 'relative', // Add position relative
              paddingLeft: '2.5rem', // Adjust padding for the "X" button
            }}
          >
              <IconButton
                onClick={(e) => {
                  e.stopPropagation(); // Prevent the click event from bubbling up to the parent MenuItem
                  handleNotifClick(notification);
                }}
                style={{ position: 'absolute', left: '0.5rem', top: '50%', transform: 'translateY(-50%)' }}
              >
                X
              </IconButton>
                   
            <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
            <Avatar alt="Flora" src="/images/avatars/4.png" />
            <Box sx={{ mx: 4, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
              <MenuItemTitle>{notification.point.name}</MenuItemTitle>
              <MenuItemSubtitle variant="body2">{notification.zone[0].name}</MenuItemSubtitle>
            </Box>
            <Typography variant="caption" sx={{ color: colors.greenAccent[600] }}>
              {formattedDate}
            </Typography>
          </Box>
        </MenuItem>
      );
    })}
  </PerfectScrollbar>
)}






        <MenuItem disableRipple sx={{ py: 3.5, borderBottom: 0, borderTop: theme => `1px solid ${theme.palette.divider}` }}>
          <Button
            style={{
              backgroundColor: colors.greenAccent[600],
            }}
            fullWidth
            variant="contained"
            onClick={handleDropdownClose}
          >
            Read All Notifications
          </Button>
        </MenuItem>
      </MuiMenu>
    </>
  );
};

export default NotificationDropdown;