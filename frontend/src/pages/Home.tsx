import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
} from '@mui/material';
import { authService, User } from '../services/authService';
import LoadingSpinner from '../components/common/LoadingSpinner';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      // Vérification simplifiée - juste vérifier si le token existe
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const currentUser = authService.getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Tableau de bord
      </Typography>

      {/* Utilisation de Box avec display: 'flex' et flexDirection: 'column' */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {/* Section principale */}
        <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: 'primary.main',
                fontSize: '2rem',
                mr: 3,
              }}
            >
              {user?.firstName?.charAt(0)}
              {user?.lastName?.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="h5">
                Bienvenue, {user?.firstName} {user?.lastName} !
              </Typography>
              <Typography color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
          </Box>

          <Typography paragraph>
            Vous êtes maintenant connecté à votre espace personnel.
          </Typography>
        </Paper>

        {/* Conteneur pour les cartes - utilisation de CSS Grid moderne */}
        <Box 
          sx={{ 
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',      // 1 colonne sur mobile
              md: 'repeat(2, 1fr)', // 2 colonnes sur tablette et desktop
            },
            gap: 3, // Espacement entre les éléments
          }}
        >
          {/* Carte 1 */}
          <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Informations du compte
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Gérez vos informations personnelles et vos préférences.
              </Typography>
              <Button variant="outlined" color="primary">
                Modifier le profil
              </Button>
            </CardContent>
          </Card>

          {/* Carte 2 */}
          <Card elevation={2} sx={{ height: '100%', borderRadius: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Statistiques
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Consultez vos activités et statistiques d'utilisation.
              </Typography>
              <Button variant="outlined" color="secondary">
                Voir les statistiques
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Box>

      <Paper elevation={2} sx={{ p: 3, mt: 4, borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          Dernières activités
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Aucune activité récente à afficher.
        </Typography>
      </Paper>
    </Box>
  );
};

export default Home;