import React from 'react';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Toolbar from '@mui/material/Toolbar';
import { NavLink } from "react-router-dom";
import AssessmentIcon from '@mui/icons-material/Assessment';
import SummarizeIcon from '@mui/icons-material/Summarize';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AllInclusiveIcon from '@mui/icons-material/AllInclusive';


const drawerWidth = 200;

export default function Navbar() {
    return (
        <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            backgroundColor: "#FFFFFF"
          },
        }}
        variant="permanent"
        anchor="left"
      >
        <Toolbar>
        <AllInclusiveIcon sx={{ color: "#504FF8", fontSize: 35 }} />
        <Typography variant="h5" color="#504FF8" sx={{ marginLeft: 1 }} noWrap component="div">
            LifeSync
        </Typography>
        </Toolbar>
        <Divider />
        <List>
            <NavLink
            to="/dashboard"
            style={({ isActive }) => ({
                textDecoration: 'none',
                color: isActive ? '#504FF8' : '#908FA6'
            })}
            >
            {({ isActive }) => (
                <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon sx={{ minWidth: 0 }}>
                    <AssessmentIcon style={{ color: isActive ? '#504FF8' : '#908FA6' }} />
                    </ListItemIcon>
                    <ListItemText
                    sx={{ marginLeft: 1, fontSize: 20 }}
                    primary="Dashboard"
                    primaryTypographyProps={{
                        fontSize: 17, 
                        style: { color: isActive ? '#504FF8' : '#908FA6' }
                    }}
                    />
                </ListItemButton>
                </ListItem>
            )}
            </NavLink>
            <NavLink
            to="/planner"
            style={({ isActive }) => ({
                textDecoration: 'none',
                color: isActive ? '#504FF8' : '#908FA6'
            })}
            >
            {({ isActive }) => (
                <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon sx={{ minWidth: 0 }}>
                    <CalendarMonthIcon style={{ color: isActive ? '#504FF8' : '#908FA6' }} />
                    </ListItemIcon>
                    <ListItemText
                    sx={{ marginLeft: 1 }}
                    primary="Planner"
                    primaryTypographyProps={{
                        fontSize: 17,
                        style: { color: isActive ? '#504FF8' : '#908FA6' }
                    }}
                    />
                </ListItemButton>
                </ListItem>
            )}
            </NavLink>
             <NavLink
            to="/family"
            style={({ isActive }) => ({
                textDecoration: 'none',
                color: isActive ? '#504FF8' : '#908FA6'
            })}
            >
            {({ isActive }) => (
                <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon sx={{ minWidth: 0 }}>
                    <FamilyRestroomIcon style={{ color: isActive ? '#504FF8' : '#908FA6' }} />
                    </ListItemIcon>
                    <ListItemText
                    sx={{ marginLeft: 1 }}
                    primary="Family"
                    primaryTypographyProps={{
                        fontSize: 17,
                        style: { color: isActive ? '#504FF8' : '#908FA6' }
                    }}
                    />
                </ListItemButton>
                </ListItem>
            )}
            </NavLink>
            <NavLink
            to="/goalshabits"
            style={({ isActive }) => ({
                textDecoration: 'none',
                color: isActive ? '#504FF8' : '#908FA6'
            })}
            >
            {({ isActive }) => (
                <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon sx={{ minWidth: 0 }}>
                    <LeaderboardIcon style={{ color: isActive ? '#504FF8' : '#908FA6' }} />
                    </ListItemIcon>
                    <ListItemText
                    sx={{ marginLeft: 1 }}
                    primary="Tracking"
                    primaryTypographyProps={{
                        fontSize: 17,
                        style: { color: isActive ? '#504FF8' : '#908FA6' }
                    }}
                    />
                </ListItemButton>
                </ListItem>
            )}
            </NavLink>
            <NavLink
            to="/customplanner"
            style={({ isActive }) => ({
                textDecoration: 'none',
                color: isActive ? '#504FF8' : '#908FA6'
            })}
            >
            {({ isActive }) => (
                <ListItem disablePadding>
                <ListItemButton>
                    <ListItemIcon sx={{ minWidth: 0 }}>
                    <SummarizeIcon style={{ color: isActive ? '#504FF8' : '#908FA6' }} />
                    </ListItemIcon>
                    <ListItemText
                    sx={{ marginLeft: 1 }}
                    primary="Custom Planner"
                    primaryTypographyProps={{
                        fontSize: 17,
                        style: { color: isActive ? '#504FF8' : '#908FA6' }
                    }}
                    />
                </ListItemButton>
                </ListItem>
            )}
            </NavLink>
        </List>
      </Drawer>
    )
}