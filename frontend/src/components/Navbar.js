import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Divider,
  Badge,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Drawer,
  Chip
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Logout as LogoutIcon,
  Dashboard as DashboardIcon,
  Phone as PhoneIcon,
  Assessment as AssessmentIcon,
  CloudUpload as UploadIcon,
  Settings as SettingsIcon,
  ListAlt as ListAltIcon,
  ConstructionRounded as ConstructionIcon,
  Person as PersonIcon,
  Group as GroupIcon,
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Queue as QueueIcon
} from '@mui/icons-material';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  
  const handleToggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const handleLogout = () => {
    handleCloseUserMenu();
    dispatch(logout());
    navigate('/login');
  };
  
  // Ana menü öğeleri - çalışan sayfalar
  const mainMenuItems = [
    { 
      text: 'Gösterge Paneli', 
      icon: <DashboardIcon />, 
      path: '/',
      showAlways: true,
      implemented: true
    },
    { 
      text: 'Çağrı Değerlendir', 
      icon: <AssessmentIcon />, 
      path: '/calls/new/evaluate',
      showAlways: true,
      implemented: true
    },
    { 
      text: 'Değerlendirmeler', 
      icon: <AssessmentIcon />, 
      path: '/evaluations',
      showAlways: true,
      implemented: true
    }
  ];
  
  // Admin menü öğeleri
  const adminMenuItems = [
    { 
      text: 'Kullanıcı Yönetimi', 
      icon: <PeopleIcon />, 
      path: '/users',
      admin: true,
      implemented: true
    },
    { 
      text: 'Sistem Ayarları', 
      icon: <SettingsIcon />, 
      path: '/settings',
      admin: true,
      implemented: false
    },
    { 
      text: 'Değerlendirme Kriterleri', 
      icon: <AssignmentIcon />, 
      path: '/criteria',
      admin: true,
      implemented: true
    },
    { 
      text: 'Çağrı Kuyrukları', 
      icon: <QueueIcon />, 
      path: '/queues',
      admin: true,
      implemented: true
    }
  ];
  
  // Filtrelenmiş menü öğeleri - Sadece uygulanmış olanlar ve kullanıcının rolüne göre filtreleme
  const filteredMenuItems = [
    ...mainMenuItems.filter(item => item.implemented),
    ...(user?.role === 'admin' ? adminMenuItems.filter(item => item.implemented) : [])
  ];
  
  // Aktif menü öğesini belirle
  const isActiveRoute = (path) => {
    if (path === '/' && location.pathname === '/') {
      return true;
    }
    return location.pathname.startsWith(path) && path !== '/';
  };
  
  const drawerContent = (
    <Box
      sx={{ width: 250 }}
      role="presentation"
      onClick={handleToggleDrawer}
    >
      <List>
        {filteredMenuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={RouterLink} 
            to={item.path}
            selected={isActiveRoute(item.path)}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.light',
                '&:hover': {
                  backgroundColor: 'primary.light',
                },
              }
            }}
          >
            <ListItemIcon>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
  
  if (!isAuthenticated) {
    return null;
  }
  
  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Mobil Menü */}
          <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="ana menü"
              onClick={handleToggleDrawer}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={handleToggleDrawer}
            >
              {drawerContent}
            </Drawer>
          </Box>
          
          {/* Başlık */}
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Çağrı Merkezi Kalite Yönetimi
          </Typography>
          
          {/* Masaüstü Menü */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {filteredMenuItems.map((item) => (
              <Button
                key={item.text}
                component={RouterLink}
                to={item.path}
                startIcon={item.icon}
                sx={{ 
                  my: 2, 
                  mx: 0.5,
                  color: 'white', 
                  display: 'flex',
                  backgroundColor: isActiveRoute(item.path) ? 'rgba(255, 255, 255, 0.15)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.25)',
                  }
                }}
              >
                {item.text}
              </Button>
            ))}
          </Box>
          
          {/* Kullanıcı Menüsü */}
          <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
            <Tooltip title="Kullanıcı işlemleri">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={user?.firstName || 'User'} src="/static/images/avatar/2.jpg">
                  {user?.firstName ? user.firstName.charAt(0) : 'U'}
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              <Typography sx={{ px: 2, py: 1 }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Divider />
              <MenuItem 
                onClick={() => {
                  handleCloseUserMenu();
                  navigate('/profile');
                }}
                disabled
              >
                <ListItemIcon>
                  <PersonIcon fontSize="small" />
                </ListItemIcon>
                <Typography textAlign="center">Profil</Typography>
                <Chip 
                  label="Geliştiriliyor" 
                  size="small" 
                  color="warning" 
                  icon={<ConstructionIcon />} 
                  sx={{ ml: 1, height: 20, fontSize: '0.6rem' }}
                />
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon fontSize="small" />
                </ListItemIcon>
                <Typography textAlign="center">Çıkış Yap</Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 