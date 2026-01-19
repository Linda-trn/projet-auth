// components/Layout/MainLayout.tsx
import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Box, 
  Typography, 
  Button, 
  IconButton, 
  Avatar, 
  Badge, 
  Menu, 
  MenuItem, 
  Container,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Popover,
  useMediaQuery,
  useTheme,
  CssBaseline
} from '@mui/material';
import { 
  School as SchoolIcon,
  Notifications as NotificationsIcon,
  Dashboard as DashboardIcon,
  MenuBook as MenuBookIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  ExitToApp as ExitToAppIcon,
  Email as EmailIcon,
  Announcement as AnnouncementIcon,
  Home as HomeIcon,
  Search as SearchIcon,
  People as PeopleIcon,
  Menu as MenuIcon
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

// Mock de authService (sans import)
const mockAuthService = {
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        return null;
      }
    }
    return null;
  },
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
  }
};

// Définition des interfaces localement
interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  profileImage?: string;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  time: string;
  read: boolean;
}

// Mock du userService
const mockUserService = {
  getProfile: async (userId: number): Promise<UserProfile> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        return {
          id: userId,
          firstName: userData.firstName || 'John',
          lastName: userData.lastName || 'Doe',
          email: userData.email || 'john.doe@example.com',
          role: userData.role || 'student',
          profileImage: userData.profileImage || ''
        };
      } catch (e) {
        // Fallback to default
      }
    }
    return {
      id: userId,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@example.com',
      role: 'student',
      profileImage: ''
    };
  },
  getUserNotifications: async (userId: number): Promise<Notification[]> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return [
      {
        id: 1,
        title: "Bienvenue sur LearnHub",
        message: "Votre compte a été créé avec succès. Commencez votre apprentissage dès maintenant !",
        type: "success",
        time: "Il y a 2 heures",
        read: false
      },
      {
        id: 2,
        title: "Cours recommandé",
        message: "Le cours 'Développement Web Avancé' pourrait vous intéresser",
        type: "info",
        time: "Il y a 1 jour",
        read: false
      },
      {
        id: 3,
        title: "Rappel de leçon",
        message: "Vous avez une leçon en attente dans le cours 'Data Science avec Python'",
        type: "warning",
        time: "Il y a 2 jours",
        read: true
      }
    ];
  },
  markNotificationAsRead: async (userId: number, notificationId: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 200));
    console.log(`Notification ${notificationId} marquée comme lue pour l'utilisateur ${userId}`);
  }
};

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState<null | HTMLElement>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUserData();
    loadNotifications();
  }, []);

  const loadUserData = async () => {
    try {
      const currentUser = mockAuthService.getCurrentUser();
      if (currentUser && currentUser.id) {
        const userProfile = await mockUserService.getProfile(currentUser.id);
        setUser(userProfile);
      }
      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des données utilisateur:', error);
      setLoading(false);
    }
  };

  const loadNotifications = async () => {
    try {
      const currentUser = mockAuthService.getCurrentUser();
      if (currentUser && currentUser.id) {
        const userNotifications = await mockUserService.getUserNotifications(currentUser.id);
        setNotifications(userNotifications);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
      // Données de démonstration
      setNotifications([
        {
          id: 1,
          title: "Bienvenue sur LearnHub",
          message: "Votre compte a été créé avec succès. Commencez votre apprentissage dès maintenant !",
          type: "success",
          time: "Il y a 2 heures",
          read: false
        },
        {
          id: 2,
          title: "Cours recommandé",
          message: "Le cours 'Développement Web Avancé' pourrait vous intéresser",
          type: "info",
          time: "Il y a 1 jour",
          read: false
        },
        {
          id: 3,
          title: "Rappel de leçon",
          message: "Vous avez une leçon en attente dans le cours 'Data Science avec Python'",
          type: "warning",
          time: "Il y a 2 jours",
          read: true
        }
      ]);
    }
  };

  const handleNotificationClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleUserMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setNotificationAnchor(null);
    setUserMenuAnchor(null);
    setMobileMenuAnchor(null);
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const currentUser = mockAuthService.getCurrentUser();
      if (currentUser && currentUser.id) {
        await mockUserService.markNotificationAsRead(currentUser.id, notificationId);
        setNotifications(notifications.map(notif => 
          notif.id === notificationId ? { ...notif, read: true } : notif
        ));
      }
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const currentUser = mockAuthService.getCurrentUser();
      if (currentUser && currentUser.id) {
        const unreadNotifications = notifications.filter(notif => !notif.read);
        for (const notif of unreadNotifications) {
          await mockUserService.markNotificationAsRead(currentUser.id, notif.id);
        }
        setNotifications(notifications.map(notif => ({ ...notif, read: true })));
      }
    } catch (error) {
      console.error('Erreur lors du marquage des notifications:', error);
    }
  };

  const handleLogout = () => {
    mockAuthService.logout();
    navigate('/login');
    handleClose();
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    handleClose();
  };

  const unreadCount = notifications.filter(notif => !notif.read).length;

  const navigationItems = [
    { path: '/', label: 'Accueil', icon: <HomeIcon /> },
    { path: '/dashboard', label: 'Tableau de bord', icon: <DashboardIcon /> },
    { path: '/courses', label: 'Cours', icon: <MenuBookIcon /> },
    { path: '/my-courses', label: 'Mes cours', icon: <MenuBookIcon /> },
    { path: '/search', label: 'Recherche', icon: <SearchIcon /> },
  ];

  if (user?.role === 'admin') {
    navigationItems.push({ path: '/instructor', label: 'Espace Instructeur', icon: <PeopleIcon /> });
  }

  if (loading) {
    return null;
  }

  return (
    <>
      <CssBaseline />
      <AppBar 
        position="sticky" 
        elevation={0}
        sx={{ 
          backgroundColor: 'white',
          borderBottom: '1px solid #e9ecef',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ minHeight: 64 }}>
            {/* Logo */}
            <Box 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                mr: 4,
                cursor: 'pointer',
                textDecoration: 'none'
              }}
              component="a"
              onClick={() => navigate('/')}
            >
              <SchoolIcon sx={{ color: '#0d8b70', fontSize: 28 }} />
              <Typography
                variant="h6"
                noWrap
                sx={{
                  fontFamily: "'Poppins', sans-serif",
                  fontWeight: 700,
                  color: '#4a6fa5',
                  letterSpacing: 0.5,
                }}
              >
                LearnHub
              </Typography>
            </Box>

            {/* Navigation Desktop */}
            {!isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', gap: 2 }}>
                {navigationItems.map((item) => (
                  <Button
                    key={item.path}
                    onClick={() => handleNavigation(item.path)}
                    startIcon={item.icon}
                    sx={{
                      color: location.pathname === item.path ? '#4a6fa5' : '#343a40',
                      fontWeight: location.pathname === item.path ? 600 : 500,
                      position: 'relative',
                      '&::after': location.pathname === item.path ? {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '2px',
                        backgroundColor: '#4a6fa5',
                      } : {},
                      '&:hover': {
                        backgroundColor: 'rgba(74, 111, 165, 0.05)',
                      }
                    }}
                  >
                    {item.label}
                  </Button>
                ))}
              </Box>
            )}

            {/* Menu Mobile */}
            {isMobile && (
              <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'flex-end' }}>
                <IconButton onClick={handleMobileMenuClick} sx={{ color: '#343a40' }}>
                  <MenuIcon />
                </IconButton>
              </Box>
            )}

            {/* User Actions */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton 
                onClick={handleNotificationClick}
                sx={{ color: '#343a40' }}
              >
                <Badge badgeContent={unreadCount} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
              
              <IconButton 
                onClick={handleUserMenuClick}
                sx={{ p: 0 }}
              >
                <Avatar
                  sx={{
                    width: 40,
                    height: 40,
                    bgcolor: '#4a6fa5',
                    fontWeight: 600,
                    fontSize: '1rem',
                  }}
                  src={user?.profileImage}
                >
                  {!user?.profileImage && `${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`}
                </Avatar>
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Contenu principal */}
      <Box
        component="main"
        sx={{
          minHeight: 'calc(100vh - 64px)',
          backgroundColor: '#f8f9fa',
        }}
      >
        {children}
      </Box>

      {/* Notifications Popover */}
      <Popover
        open={Boolean(notificationAnchor)}
        anchorEl={notificationAnchor}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { 
            width: 380, 
            maxHeight: 500,
            borderRadius: 2,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            mt: 1
          }
        }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid #e9ecef' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Button 
                size="small" 
                onClick={handleMarkAllAsRead}
                sx={{ textTransform: 'none' }}
              >
                Tout marquer comme lu
              </Button>
            )}
          </Box>
        </Box>
        
        <List sx={{ p: 0 }}>
          {notifications.length === 0 ? (
            <ListItem>
              <ListItemText 
                primary="Aucune notification"
                secondary="Vous êtes à jour !"
                sx={{ textAlign: 'center', py: 2 }}
              />
            </ListItem>
          ) : (
            notifications.map((notification) => (
              <ListItem
                key={notification.id}
                sx={{
                  py: 2,
                  px: 2,
                  borderBottom: '1px solid #f1f3f4',
                  backgroundColor: notification.read ? 'transparent' : 'rgba(74, 111, 165, 0.05)',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(74, 111, 165, 0.1)',
                  }
                }}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: 
                        notification.type === 'success' ? '#28a745' :
                        notification.type === 'warning' ? '#ffc107' :
                        notification.type === 'error' ? '#dc3545' : '#4a6fa5'
                    }}
                  >
                    {notification.type === 'success' ? <EmailIcon /> :
                     notification.type === 'warning' ? <AnnouncementIcon /> :
                     <NotificationsIcon />}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography variant="body1" sx={{ fontWeight: notification.read ? 400 : 600 }}>
                      {notification.title}
                    </Typography>
                  }
                  secondary={
                    <>
                      <Typography variant="body2" color="text.secondary">
                        {notification.message}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                        {notification.time}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            ))
          )}
        </List>
        
        {notifications.length > 0 && (
          <Box sx={{ p: 2, borderTop: '1px solid #e9ecef' }}>
            <Button 
              fullWidth 
              onClick={() => {
                navigate('/notifications');
                handleClose();
              }}
              sx={{ textTransform: 'none' }}
            >
              Voir toutes les notifications
            </Button>
          </Box>
        )}
      </Popover>

      {/* User Menu Popover */}
      <Popover
        open={Boolean(userMenuAnchor)}
        anchorEl={userMenuAnchor}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { 
            width: 280,
            borderRadius: 2,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            mt: 1
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                bgcolor: '#4a6fa5',
                fontWeight: 600,
                fontSize: '1.2rem',
              }}
              src={user?.profileImage}
            >
              {!user?.profileImage && `${user?.firstName?.charAt(0) || ''}${user?.lastName?.charAt(0) || ''}`}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
          </Box>
          
          <Divider sx={{ my: 1 }} />
          
          <List sx={{ p: 0 }}>
            <MenuItem onClick={() => handleNavigation('/profile')}>
              <PersonIcon sx={{ mr: 2, color: '#4a6fa5' }} />
              Mon profil
            </MenuItem>
            <MenuItem onClick={() => handleNavigation('/dashboard')}>
              <DashboardIcon sx={{ mr: 2, color: '#4a6fa5' }} />
              Tableau de bord
            </MenuItem>
            <MenuItem onClick={() => handleNavigation('/my-courses')}>
              <MenuBookIcon sx={{ mr: 2, color: '#4a6fa5' }} />
              Mes cours
            </MenuItem>
            <MenuItem onClick={() => handleNavigation('/settings')}>
              <SettingsIcon sx={{ mr: 2, color: '#4a6fa5' }} />
              Paramètres
            </MenuItem>
            
            <Divider sx={{ my: 1 }} />
            
            <MenuItem onClick={handleLogout}>
              <ExitToAppIcon sx={{ mr: 2, color: '#dc3545' }} />
              <Typography color="error">Déconnexion</Typography>
            </MenuItem>
          </List>
        </Box>
      </Popover>

      {/* Mobile Menu Popover */}
      <Popover
        open={Boolean(mobileMenuAnchor)}
        anchorEl={mobileMenuAnchor}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: { 
            width: 250,
            borderRadius: 2,
            boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            mt: 1
          }
        }}
      >
        <List sx={{ p: 0 }}>
          {navigationItems.map((item) => (
            <MenuItem 
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              selected={location.pathname === item.path}
              sx={{
                color: location.pathname === item.path ? '#4a6fa5' : 'inherit',
                fontWeight: location.pathname === item.path ? 600 : 400,
              }}
            >
              {item.icon}
              <Typography sx={{ ml: 2 }}>
                {item.label}
              </Typography>
            </MenuItem>
          ))}
        </List>
      </Popover>
    </>
  );
};

export default MainLayout;