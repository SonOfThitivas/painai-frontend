import * as React from 'react';
import { styled, useTheme, Theme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { red } from '@mui/material/colors';
import { Button } from '@mui/material';

const drawerWidth = 240;

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

// const OpenDrawerButton = ({theme}: {theme: Theme}) => {
//     return (
//         <div>
//             <Box 
//             component="div" 
//             sx={{
//                 border: 1,
//                 borderColor: "red",
//                 position: "absolute",
//                 // marginTop: 1/2,
//                 height: 100,
//                 width: 100,
//                 zIndex: "modal",
//                 backgroundColor: "white"
//             }}>
//                 {theme.direction === 'ltr' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
//             </Box>
//         </div>
//     )
// }

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        width: `calc(100% - ${drawerWidth}px)`,
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        backgroundColor: "transparent",
      },
    },
  ],
}));

const ButtonDrawer = styled(Button, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  variants: [
    {
      props: ({ open }) => open,
      style: {
        // width: `calc(100% - ${drawerWidth}px)`,
        position: "fixed",
        marginLeft: `${drawerWidth}px`,
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
        backgroundColor: "transparent",
      },
    },
  ],
}));

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end',
}));


export default function SideBarNavigator() {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const listItem = [
    {
        name: "Home",
        func: null,
    },
    {
        name: "Activity Lobby",
        func: null,
    },
    {
        name: "Create a Activity",
        func: null,
    }
  ]

  const handleDrawer = () => {
    setOpen(!open)
  }

  return (
    <Box sx={{ display: 'flex'}}>
        <CssBaseline />
        {/* <AppBar position="fixed" open={open} sx={{backgroundColor: "transparent", boxShadow: 0}}>
            <Toolbar>
            <IconButton
                color="inherit"
                aria-label="open drawer"
                onClick={handleDrawerOpen}
                edge="start"
                sx={[
                {
                    mr: 2,
                },
                open && { display: 'none' },
                ]}
            >
                <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div">
                Persistent drawer
            </Typography>
            </Toolbar>
        </AppBar> */}
        
        {/* <OpenDrawerButton theme={theme}/> */}

        <ButtonDrawer onClick={handleDrawer} open={open}
        // sx={{
            
        //     position:"fixed",
        //     zIndex:2000,
        //     left:drawerWidth,
        //     top:"50%"
            
        // }}
        >
            {/* {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />} */}
            {open === true ? <ChevronLeftIcon /> : <ChevronRightIcon />}

        </ButtonDrawer>

        <Drawer
            sx={{
            width: drawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box',
            },
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            
            <DrawerHeader>
                <IconButton onClick={handleDrawer}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </DrawerHeader>

            <Divider />
            <List>
            {listItem.map((obj, index) => (
                <ListItem key={obj.name} disablePadding>
                <ListItemButton>
                    {/* <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                    </ListItemIcon> */}
                    <ListItemText primary={obj.name} />
                </ListItemButton>
                </ListItem>
            ))}
            </List>
            <Divider />
        </Drawer>
            
        
    </Box>
  );
}
