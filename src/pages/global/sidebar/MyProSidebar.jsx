
import { useState } from "react";
import { Menu, Sidebar, MenuItem } from "react-pro-sidebar";
import { useProSidebar } from "react-pro-sidebar";
import { useSidebarContext } from "./sidebarContext";
import { Link } from "react-router-dom";
import { tokens } from "../../../theme";
import { useTheme, Box, Typography, IconButton } from "@mui/material";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";
const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  return (
    <MenuItem
      active={selected === title}
      style={{ color: colors.grey[100] }}
      onClick={() => setSelected(title)}
      icon={icon}
      routerLink={<Link to={to} />}
    >
      <Typography>{title}</Typography>

    </MenuItem>
  );
};

const MyProSidebar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [selected, setSelected] = useState("Dashboard");
  const {sidebarImage } = useSidebarContext();
  const { collapseSidebar, toggleSidebar, collapsed, broken } = useProSidebar();
  return (
    <Box

    sx={{
      position: "sticky",
      display: "flex",
      height: "100vh",
      top: 0,
      bottom: 0,
      
      zIndex: 10000,

      "& .sidebar": {
        border: "none",
      },
      "& .menu-icon": {
        backgroundColor: "transparent !important",
      },
      "& .menu-item": {
        // padding: "5px 35px 5px 20px !important",
        backgroundColor: "transparent !important",
      },
      "& .menu-anchor": {
        color: "inherit !important",
        backgroundColor: "transparent !important",
      },
      "& .menu-item:hover": {
        color: `${colors.grey[100]} !important`,
        backgroundColor: "transparent !important",
      },
      "& .menu-item.active": {
        color: `${colors.greenAccent[500]} !important`,
        backgroundColor: "transparent !important",
      },
    
        
      }}
    >
      <Sidebar

        breakPoint="md"
        backgroundColor={colors.primary[400]}
        image={sidebarImage}
      >
        <Menu iconshape="square">
          <MenuItem
            icon={
              collapsed ? 
                <MenuOutlinedIcon onClick={() => collapseSidebar()} />:undefined
              
            }
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!collapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                {/* <Typography variant="h3" color={colors.grey[100]}>
                  ADMIN
                </Typography> */}
                <IconButton
                  onClick={
                    broken ? () => toggleSidebar() : () => collapseSidebar()
                  }
                >
                  <CloseOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>
          {!collapsed && (
            <Box mb="20px">
              <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                  "& .avater-image": {
                    backgroundColor: colors.primary[500],
                  },
                }}
              >
                  <img
                   className="avater-image"
                  alt="profile user"
                  width="100px"
                  height="100px"
                  src={"data:image/png;base64,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"}
                  style={{ cursor: "pointer", borderRadius: "40%" }}
                />   
               </Box> 
              <Box textAlign="center">
                 <Typography
                  variant="h3"
                  color={colors.grey[100]}
                  fontWeight="bold"
                  sx={{ m: "10px 0 0 0" }}
                >
                 CRNS
                </Typography> 
               </Box> 
            </Box>
          )}
          <Box paddingLeft={collapsed ? undefined : "10%"}>
          <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 20px 5px 20px" }}
            >
              Home
            </Typography>
            <Item
              title="Dashboard"
              to="/Dashboard"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 20px 5px 20px" }}
            >
              Data
            </Typography>
            {/* <Item
              title="Manage Team"
              to="/team"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            <Item
              title="Users Information"
              to="/Dashboard/contacts"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="History"
              to="/Dashboard/History"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 20px 5px 20px" }}
            >
              Pages
            </Typography>
            {/* <Item
              title=" Create User "
              to="/Dashboard/form"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}
            <Item
              title="Calendar"
              to="/Dashboard/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            {/* <Item
              title="FAQ Page"
              to="/Dashboard/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            /> */}

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 20px 5px 20px" }}
            >
              Charts
            </Typography>
            <Item
              title="Bar Chart"
              to="/Dashboard/bar"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Pie Chart"
              to="/Dashboard/pie"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Line Chart"
              to="/Dashboard/line"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            <Item
              title="Geography Chart"
              to="/Dashboard/geography"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            
          </Box>
          
        </Menu>
      </Sidebar>
    </Box>
  );
};

export default MyProSidebar;
