import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  Avatar,
  Tooltip,
  Container,
  Divider,
  ListItemIcon,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CallIcon from '@mui/icons-material/Call';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PeopleIcon from '@mui/icons-material/People';
import RuleIcon from '@mui/icons-material/Rule';

import { logout } from '../store/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleCloseUserMenu();
    navigate('/login');
  };

  const handleProfile = () => {
    navigate('/profile');
    handleCloseUserMenu();
  };

  return (
    <AppBar position="static">
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          {/* Logo - Desktop */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Çağrı Merkezi KYS
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            {isAuthenticated && (
              <>
                <IconButton
                  size="large"
                  aria-label="menu"
                  aria-controls="menu-appbar"
                  aria-haspopup="true"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorElNav}
                  anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                  sx={{
                    display: { xs: 'block', md: 'none' },
                  }}
                >
                  <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/'); }}>
                    <ListItemIcon>
                      <DashboardIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Dashboard</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/calls'); }}>
                    <ListItemIcon>
                      <CallIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Çağrılar</Typography>
                  </MenuItem>
                  <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/evaluations'); }}>
                    <ListItemIcon>
                      <AssessmentIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Değerlendirmeler</Typography>
                  </MenuItem>
                  {user && user.role === 'admin' && (
                    <>
                      <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/users'); }}>
                        <ListItemIcon>
                          <PeopleIcon fontSize="small" />
                        </ListItemIcon>
                        <Typography textAlign="center">Kullanıcılar</Typography>
                      </MenuItem>
                      <MenuItem onClick={() => { handleCloseNavMenu(); navigate('/criteria'); }}>
                        <ListItemIcon>
                          <RuleIcon fontSize="small" />
                        </ListItemIcon>
                        <Typography textAlign="center">Değerlendirme Kriterleri</Typography>
                      </MenuItem>
                    </>
                  )}
                </Menu>
              </>
            )}
          </Box>

          {/* Logo - Mobile */}
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            Çağrı Merkezi KYS
          </Typography>

          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {isAuthenticated && (
              <>
                <Button
                  onClick={() => navigate('/')}
                  sx={{ my: 2, color: 'white', display: 'flex', alignItems: 'center' }}
                  startIcon={<DashboardIcon />}
                >
                  Dashboard
                </Button>
                <Button
                  onClick={() => navigate('/calls')}
                  sx={{ my: 2, color: 'white', display: 'flex', alignItems: 'center' }}
                  startIcon={<CallIcon />}
                >
                  Çağrılar
                </Button>
                <Button
                  onClick={() => navigate('/evaluations')}
                  sx={{ my: 2, color: 'white', display: 'flex', alignItems: 'center' }}
                  startIcon={<AssessmentIcon />}
                >
                  Değerlendirmeler
                </Button>
                {user && user.role === 'admin' && (
                  <>
                    <Button
                      onClick={() => navigate('/users')}
                      sx={{ my: 2, color: 'white', display: 'flex', alignItems: 'center' }}
                      startIcon={<PeopleIcon />}
                    >
                      Kullanıcılar
                    </Button>
                    <Button
                      onClick={() => navigate('/criteria')}
                      sx={{ my: 2, color: 'white', display: 'flex', alignItems: 'center' }}
                      startIcon={<RuleIcon />}
                    >
                      Değerlendirme Kriterleri
                    </Button>
                  </>
                )}
              </>
            )}
          </Box>

          {/* User menu */}
          <Box sx={{ flexGrow: 0 }}>
            {isAuthenticated ? (
              <>
                <Tooltip title="Profil">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar alt={user?.username || 'User'} src="/static/images/avatar/2.jpg">
                      {user?.username?.charAt(0) || 'U'}
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
                  <MenuItem onClick={handleProfile}>
                    <ListItemIcon>
                      <AccountCircleIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Profil</Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    <Typography textAlign="center">Çıkış Yap</Typography>
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button color="inherit" onClick={() => navigate('/login')}>
                Giriş Yap
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 