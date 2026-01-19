// pages/Home.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Paper,
  Box,
  Card,
  CardContent,
  Avatar,
  Button,
  LinearProgress,
  Chip,
  Divider,
  Alert,
  AlertTitle,
  IconButton,
  alpha
} from '@mui/material';
import {
  School as SchoolIcon,
  TrendingUp as TrendingUpIcon,
  Book as BookIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  PlayCircle as PlayCircleIcon,
  ArrowForward as ArrowForwardIcon,
  AutoStories as AutoStoriesIcon,
  EmojiEvents as EmojiEventsIcon,
  Groups as GroupsIcon,
  Schedule as ScheduleIcon,
  Whatshot as WhatshotIcon,
  RocketLaunch as RocketLaunchIcon,
  Lightbulb as LightbulbIcon,
  Psychology as PsychologyIcon,
  Code as CodeIcon,
  DesignServices as DesignServicesIcon
} from '@mui/icons-material';

// Définition des interfaces localement
interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  profileImage?: string;
}

interface UserStats {
  courses: number;
  lessons: number;
  hours: number;
  certificates: number;
  streak: number;
}

// Mock de authService
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
  
  getUserStats: async (userId: number): Promise<UserStats> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return {
      courses: 3,
      lessons: 125,
      hours: 45,
      certificates: 2,
      streak: 7
    };
  }
};

// Mock du LoadingSpinner (remplacez par le vrai composant si disponible)
const LoadingSpinner = () => (
  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <Typography variant="h6" color="primary">
      Chargement...
    </Typography>
  </Box>
);

// Données de démonstration pour les cours
const sampleCourses = [
  {
    id: 1,
    title: "Développement Web Full Stack",
    category: "Développement",
    instructor: "Alexandre Martin",
    duration: "42 heures",
    lessons: 58,
    students: 3450,
    rating: 4.9,
    progress: 78,
    isFavorite: true,
    isEnrolled: true,
    description: "Devenez développeur Full Stack en maîtrisant React, Node.js et les bases de données.",
    color: "#6366f1",
    icon: <CodeIcon />
  },
  {
    id: 2,
    title: "Data Science & Machine Learning",
    category: "Data Science",
    instructor: "Sophie Dubois",
    duration: "52 heures",
    lessons: 72,
    students: 2180,
    rating: 4.8,
    progress: 45,
    isFavorite: false,
    isEnrolled: true,
    description: "Apprenez à créer des modèles prédictifs et à analyser des données complexes.",
    color: "#10b981",
    icon: <PsychologyIcon />
  },
  {
    id: 3,
    title: "UI/UX Design Avancé",
    category: "Design",
    instructor: "Léa Bernard",
    duration: "36 heures",
    lessons: 48,
    students: 1870,
    rating: 4.9,
    progress: 32,
    isFavorite: true,
    isEnrolled: true,
    description: "Maîtrisez les principes du design d'expérience utilisateur et des interfaces modernes.",
    color: "#f59e0b",
    icon: <DesignServicesIcon />
  },
  {
    id: 4,
    title: "Intelligence Artificielle",
    category: "AI",
    instructor: "Thomas Moreau",
    duration: "48 heures",
    lessons: 65,
    students: 4280,
    rating: 4.7,
    progress: 0,
    isFavorite: false,
    isEnrolled: false,
    description: "Découvrez les concepts fondamentaux de l'IA et les réseaux neuronaux.",
    color: "#8b5cf6",
    icon: <PsychologyIcon />
  },
  {
    id: 5,
    title: "Marketing Digital",
    category: "Marketing",
    instructor: "Camille Leroy",
    duration: "28 heures",
    lessons: 40,
    students: 2950,
    rating: 4.6,
    progress: 0,
    isFavorite: false,
    isEnrolled: false,
    description: "Stratégies de marketing digital et gestion des réseaux sociaux.",
    color: "#ec4899",
    icon: <TrendingUpIcon />
  },
  {
    id: 6,
    title: "DevOps & Cloud",
    category: "Infrastructure",
    instructor: "Nicolas Petit",
    duration: "38 heures",
    lessons: 52,
    students: 1650,
    rating: 4.8,
    progress: 0,
    isFavorite: false,
    isEnrolled: false,
    description: "Automatisez vos déploiements avec Docker, Kubernetes et AWS.",
    color: "#06b6d4",
    icon: <RocketLaunchIcon />
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<number[]>([1, 3]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token') || localStorage.getItem('auth_token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const currentUser = mockAuthService.getCurrentUser();
        if (currentUser && currentUser.id) {
          // Utilisez mockUserService au lieu de userService
          const userProfile = await mockUserService.getProfile(currentUser.id);
          const userStats = await mockUserService.getUserStats(currentUser.id);
          setUser(userProfile);
          setStats(userStats);
        }
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors du chargement:', error);
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const toggleFavorite = (courseId: number) => {
    if (favorites.includes(courseId)) {
      setFavorites(favorites.filter(id => id !== courseId));
    } else {
      setFavorites([...favorites, courseId]);
    }
  };

  const handleContinueLearning = (courseId: number) => {
    navigate(`/course/${courseId}`);
  };

  const handleViewCourse = (courseId: number) => {
    navigate(`/course/${courseId}/details`);
  };

  const handleEnrollCourse = (courseId: number) => {
    navigate(`/course/${courseId}/enroll`);
  };

  const enrolledCourses = sampleCourses.filter(course => course.isEnrolled);
  const recommendedCourses = sampleCourses.filter(course => !course.isEnrolled).slice(0, 3);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Box sx={{ backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: { xs: 6, md: 8 },
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container maxWidth="lg">
          <Box sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 4
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 800,
                  color: 'white',
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  lineHeight: 1.2
                }}
              >
                Bienvenue sur <Box component="span" sx={{ color: '#fbbf24' }}>LearnHub</Box>
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  color: 'rgba(255, 255, 255, 0.9)',
                  mb: 4,
                  fontWeight: 400
                }}
              >
                Votre plateforme d'apprentissage en ligne pour développer vos compétences et booster votre carrière.
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    backgroundColor: '#fbbf24',
                    color: '#1e293b',
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: '#f59e0b',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
                    },
                    transition: 'all 0.3s'
                  }}
                  startIcon={<PlayCircleIcon />}
                  onClick={() => navigate('/my-courses')}
                >
                  Continuer l'apprentissage
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      borderColor: 'white'
                    }
                  }}
                  startIcon={<BookIcon />}
                  onClick={() => navigate('/courses')}
                >
                  Explorer les cours
                </Button>
              </Box>
            </Box>
            
            <Box sx={{ 
              display: { xs: 'none', md: 'flex' },
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Box sx={{
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <Box sx={{
                  width: 300,
                  height: 300,
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Avatar
                    sx={{
                      width: 220,
                      height: 220,
                      bgcolor: '#fbbf24',
                      color: '#1e293b',
                      fontSize: '4rem',
                      fontWeight: 800,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                    }}
                    src={user?.profileImage}
                  >
                    {!user?.profileImage && `${user?.firstName?.charAt(0)}${user?.lastName?.charAt(0)}`}
                  </Avatar>
                </Box>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Statistiques */}
      <Container maxWidth="lg" sx={{ mt: -4, position: 'relative', zIndex: 1 }}>
        <Box sx={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 3,
          '& > *': {
            flex: '1 1 calc(25% - 24px)',
            minWidth: { xs: '100%', sm: 'calc(50% - 24px)', md: 'calc(25% - 24px)' }
          }
        }}>
          {[
            { label: 'Cours Actifs', value: stats?.courses || 3, icon: <AutoStoriesIcon />, color: '#6366f1', bgColor: '#e0e7ff' },
            { label: 'Leçons Terminées', value: stats?.lessons || 125, icon: <CheckCircleIcon />, color: '#10b981', bgColor: '#d1fae5' },
            { label: 'Heures Cumulées', value: stats?.hours || 45, icon: <ScheduleIcon />, color: '#f59e0b', bgColor: '#fef3c7' },
            { label: 'Certificats', value: stats?.certificates || 2, icon: <EmojiEventsIcon />, color: '#ec4899', bgColor: '#fce7f3' }
          ].map((item, index) => (
            <Card key={index} sx={{
              height: '100%',
              borderRadius: 3,
              boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
              border: 'none',
              transition: 'all 0.3s',
              '&:hover': {
                transform: 'translateY(-8px)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
              }
            }}>
              <CardContent sx={{ p: 3, textAlign: 'center' }}>
                <Box sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 70,
                  height: 70,
                  borderRadius: 2,
                  backgroundColor: item.bgColor,
                  mb: 2
                }}>
                  {React.cloneElement(item.icon, { sx: { fontSize: 32, color: item.color } })}
                </Box>
                <Typography variant="h2" sx={{
                  fontWeight: 800,
                  color: item.color,
                  mb: 1,
                  fontSize: '3rem'
                }}>
                  {item.value}
                </Typography>
                <Typography variant="h6" sx={{ color: '#475569', fontWeight: 600 }}>
                  {item.label}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', lg: 'row' }, 
          gap: 4 
        }}>
          {/* Colonne principale */}
          <Box sx={{ flex: { lg: 8 } }}>
            {/* Cours en progression */}
            <Paper elevation={0} sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              mb: 4,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              border: '1px solid #e2e8f0'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
                    Continuer votre apprentissage
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#64748b' }}>
                    Reprenez là où vous vous étiez arrêté
                  </Typography>
                </Box>
                <Button
                  variant="text"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ fontWeight: 700 }}
                  onClick={() => navigate('/my-courses')}
                >
                  Voir tout
                </Button>
              </Box>

              {enrolledCourses.length > 0 ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {enrolledCourses.map((course) => (
                    <Card
                      key={course.id}
                      onClick={() => handleContinueLearning(course.id)}
                      sx={{
                        borderRadius: 2,
                        border: 'none',
                        boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                        transition: 'all 0.3s',
                        cursor: 'pointer',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 15px 30px rgba(0,0,0,0.1)'
                        }
                      }}
                    >
                      <CardContent sx={{ p: 3 }}>
                        <Box sx={{ 
                          display: 'flex', 
                          flexDirection: { xs: 'column', md: 'row' },
                          justifyContent: 'space-between',
                          alignItems: { xs: 'flex-start', md: 'center' },
                          gap: 3
                        }}>
                          <Box sx={{ flex: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                              <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 50,
                                height: 50,
                                borderRadius: 2,
                                backgroundColor: alpha(course.color, 0.1)
                              }}>
                                {React.cloneElement(course.icon, { sx: { color: course.color, fontSize: 24 } })}
                              </Box>
                              <Box>
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b' }}>
                                  {course.title}
                                </Typography>
                                <Typography variant="body2" sx={{ color: '#64748b' }}>
                                  {course.category} • Par {course.instructor}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ mt: 3 }}>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                                  Votre progression
                                </Typography>
                                <Typography variant="body2" sx={{ color: course.color, fontWeight: 800 }}>
                                  {course.progress}%
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={course.progress}
                                sx={{
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor: '#e2e8f0',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: course.color,
                                    borderRadius: 4,
                                  },
                                }}
                              />
                            </Box>
                          </Box>
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: course.color,
                              color: 'white',
                              fontWeight: 700,
                              px: 4,
                              py: 1.5,
                              borderRadius: 2,
                              '&:hover': {
                                backgroundColor: course.color,
                                transform: 'translateY(-2px)'
                              },
                              transition: 'all 0.3s'
                            }}
                          >
                            Continuer
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              ) : (
                <Box sx={{ textAlign: 'center', py: 6 }}>
                  <AutoStoriesIcon sx={{ fontSize: 64, color: '#cbd5e1', mb: 3 }} />
                  <Typography variant="h5" sx={{ color: '#64748b', fontWeight: 600, mb: 2 }}>
                    Aucun cours en cours
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#94a3b8', mb: 4, maxWidth: 400, mx: 'auto' }}>
                    Découvrez notre catalogue de cours et commencez votre apprentissage dès aujourd'hui !
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/courses')}
                    sx={{
                      backgroundColor: '#6366f1',
                      fontWeight: 700,
                      px: 4,
                      py: 1.5,
                      borderRadius: 2
                    }}
                  >
                    Explorer les cours
                  </Button>
                </Box>
              )}
            </Paper>

            {/* Cours recommandés */}
            <Paper elevation={0} sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              border: '1px solid #e2e8f0'
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Box>
                  <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
                    Recommandés pour vous
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#64748b' }}>
                    Découvrez les cours les plus populaires
                  </Typography>
                </Box>
                <Button
                  variant="text"
                  color="primary"
                  endIcon={<ArrowForwardIcon />}
                  sx={{ fontWeight: 700 }}
                  onClick={() => navigate('/courses')}
                >
                  Voir tout
                </Button>
              </Box>

              <Box sx={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: 3,
                '& > *': {
                  flex: '1 1 calc(50% - 12px)',
                  minWidth: { xs: '100%', sm: 'calc(50% - 12px)' }
                }
              }}>
                {recommendedCourses.map((course) => (
                  <Card
                    key={course.id}
                    onClick={() => handleViewCourse(course.id)}
                    sx={{
                      height: '100%',
                      borderRadius: 2,
                      border: 'none',
                      boxShadow: '0 5px 15px rgba(0,0,0,0.05)',
                      transition: 'all 0.3s',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: `0 20px 40px ${alpha(course.color, 0.15)}`
                      }
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                        <Box sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 60,
                          height: 60,
                          borderRadius: 2,
                          backgroundColor: alpha(course.color, 0.1)
                        }}>
                          {React.cloneElement(course.icon, { sx: { color: course.color, fontSize: 28 } })}
                        </Box>
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(course.id);
                          }}
                          sx={{
                            color: favorites.includes(course.id) ? '#ef4444' : '#cbd5e1',
                            '&:hover': { color: '#ef4444' }
                          }}
                        >
                          {favorites.includes(course.id) ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                        </IconButton>
                      </Box>

                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#1e293b', mb: 2, minHeight: 64 }}>
                        {course.title}
                      </Typography>

                      <Typography variant="body2" sx={{ color: '#64748b', mb: 3, minHeight: 60 }}>
                        {course.description}
                      </Typography>

                      <Divider sx={{ my: 2, borderColor: '#e2e8f0' }} />

                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon sx={{ fontSize: 16, color: '#94a3b8' }} />
                          <Typography variant="body2" sx={{ color: '#64748b' }}>
                            {course.instructor}
                          </Typography>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <StarIcon sx={{ fontSize: 16, color: '#fbbf24' }} />
                          <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                            {course.rating}
                          </Typography>
                        </Box>
                      </Box>

                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          backgroundColor: course.color,
                          color: 'white',
                          fontWeight: 700,
                          py: 1.5,
                          borderRadius: 2,
                          '&:hover': {
                            backgroundColor: course.color,
                            transform: 'translateY(-2px)'
                          },
                          transition: 'all 0.3s'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEnrollCourse(course.id);
                        }}
                      >
                        Commencer maintenant
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </Paper>
          </Box>

          {/* Barre latérale */}
          <Box sx={{ flex: { lg: 4 } }}>
            {/* Profil utilisateur */}
            <Paper elevation={0} sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              mb: 4,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.2)'
            }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: 'white',
                    color: '#6366f1',
                    fontSize: '2.5rem',
                    fontWeight: 800,
                    margin: '0 auto',
                    mb: 2,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                  }}
                  src={user?.profileImage}
                >
                  {!user?.profileImage && `${user?.firstName?.charAt(0)}${user?.lastName?.charAt(0)}`}
                </Avatar>
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                  {user?.firstName} {user?.lastName}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mb: 2 }}>
                  {user?.email}
                </Typography>
                <Chip
                  label={user?.role === 'admin' ? 'Administrateur' : 'Étudiant'}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    fontWeight: 600,
                    borderRadius: 2
                  }}
                />
              </Box>

              <Button
                variant="outlined"
                fullWidth
                sx={{
                  borderColor: 'white',
                  color: 'white',
                  fontWeight: 700,
                  py: 1.5,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'white'
                  }
                }}
                startIcon={<PersonIcon />}
                onClick={() => navigate('/profile')}
              >
                Modifier le profil
              </Button>
            </Paper>

            {/* Série d'apprentissage */}
            <Paper elevation={0} sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              mb: 4,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              border: '1px solid #e2e8f0'
            }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Box sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 80,
                  height: 80,
                  borderRadius: '50%',
                  backgroundColor: '#fef3c7',
                  mb: 3
                }}>
                  <WhatshotIcon sx={{ fontSize: 40, color: '#f59e0b' }} />
                </Box>
                <Typography variant="h2" sx={{ fontWeight: 800, color: '#1e293b', mb: 1 }}>
                  {stats?.streak || 7}
                </Typography>
                <Typography variant="h6" sx={{ color: '#64748b', fontWeight: 600, mb: 2 }}>
                  Jours consécutifs
                </Typography>
                <Chip
                  label="🔥 Série en cours"
                  sx={{
                    backgroundColor: '#fef3c7',
                    color: '#92400e',
                    fontWeight: 700,
                    borderRadius: 2
                  }}
                />
              </Box>

              <Alert
                severity="info"
                sx={{
                  backgroundColor: '#e0f2fe',
                  color: '#0369a1',
                  borderRadius: 2,
                  border: 'none',
                  mb: 3
                }}
                icon={<LightbulbIcon sx={{ color: '#0284c7' }} />}
              >
                <AlertTitle sx={{ fontWeight: 600 }}>Conseil du jour</AlertTitle>
                Consacrez 30 minutes à l'apprentissage aujourd'hui pour maintenir votre série !
              </Alert>
            </Paper>

            {/* Objectifs */}
            <Paper elevation={0} sx={{
              p: { xs: 3, md: 4 },
              borderRadius: 3,
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
              border: '1px solid #e2e8f0'
            }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1e293b', mb: 3 }}>
                Objectifs de la semaine
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                    Leçons complétées
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 800 }}>
                    8/12
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={66}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#10b981',
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2" sx={{ color: '#64748b', fontWeight: 600 }}>
                    Heures d'apprentissage
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#6366f1', fontWeight: 800 }}>
                    12/15 heures
                  </Typography>
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={80}
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#e2e8f0',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: '#6366f1',
                      borderRadius: 4,
                    },
                  }}
                />
              </Box>

              <Button
                variant="contained"
                fullWidth
                sx={{
                  backgroundColor: '#6366f1',
                  color: 'white',
                  fontWeight: 700,
                  py: 1.5,
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: '#4f46e5',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s'
                }}
                startIcon={<TrendingUpIcon />}
                onClick={() => navigate('/dashboard')}
              >
                Voir les détails
              </Button>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;