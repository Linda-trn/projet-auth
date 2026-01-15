import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { authService } from '../services/authService';
import AlertMessage from '../components/common/AlertMessage';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
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
    setLoading(true);

    try {
      await authService.login(formData.email, formData.password);
      setAlert({
        open: true,
        severity: 'success',
        message: 'Connexion réussie !',
      });
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error: any) {
      setAlert({
        open: true,
        severity: 'error',
        message: error.response?.data?.message || 'Erreur de connexion',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
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
            Connexion
          </Typography>

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Adresse Email"
              name="email"
              autoComplete="email"
              autoFocus
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Mot de passe"
              type={showPassword ? 'text' : 'password'}
              id="password"
              autoComplete="current-password"
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, py: 1.5 }}
              disabled={loading}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </Button>

            <Box textAlign="center">
              <Typography variant="body2">
                Pas encore de compte ?{' '}
                <RouterLink
                  to="/register"
                  style={{ color: '#1976d2', textDecoration: 'none' }}
                >
                  S'inscrire
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

export default Login;