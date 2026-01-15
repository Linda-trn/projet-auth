import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { authService } from '../services/authService';
import AlertMessage from '../components/common/AlertMessage';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    open: boolean;
    severity: 'success' | 'error' | 'info' | 'warning';
    message: string;
  }>({
    open: false,
    severity: 'info',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.password !== formData.confirmPassword) {
      setAlert({
        open: true,
        severity: 'error',
        message: 'Les mots de passe ne correspondent pas',
      });
      return;
    }

    if (formData.password.length < 6) {
      setAlert({
        open: true,
        severity: 'error',
        message: 'Le mot de passe doit contenir au moins 6 caractères',
      });
      return;
    }

    setLoading(true);

    try {
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      };

      await authService.register(userData);
      setAlert({
        open: true,
        severity: 'success',
        message: 'Inscription réussie ! Veuillez vous connecter.',
      });
      
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error: any) {
      setAlert({
        open: true,
        severity: 'error',
        message: error.message || "Erreur lors de l'inscription",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            borderRadius: 2,
          }}
        >
          <Typography component="h1" variant="h5" align="center" gutterBottom>
            Créer un compte
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {/* Utilisation de Box au lieu de Grid */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Prénom et Nom sur la même ligne */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                gap: 2 
              }}>
                <TextField
                  required
                  fullWidth
                  id="firstName"
                  label="Prénom"
                  name="firstName"
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={handleChange}
                  variant="outlined"
                />
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Nom"
                  name="lastName"
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Box>

              <TextField
                required
                fullWidth
                id="email"
                label="Adresse Email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
                variant="outlined"
              />

              {/* Mot de passe et Confirmation */}
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                gap: 2 
              }}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Mot de passe"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="new-password"
                  value={formData.password}
                  onChange={handleChange}
                  variant="outlined"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirmer le mot de passe"
                  type={showPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  variant="outlined"
                />
              </Box>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? 'Inscription...' : "S'inscrire"}
            </Button>

            <Box textAlign="center">
              <Typography variant="body2">
                Déjà un compte ?{' '}
                <RouterLink
                  to="/login"
                  style={{ color: '#1976d2', textDecoration: 'none' }}
                >
                  Se connecter
                </RouterLink>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>

      <AlertMessage
        open={alert.open}
        severity={alert.severity}
        message={alert.message}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </Container>
  );
};

export default Register;