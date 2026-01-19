// services/userService.ts
export interface UserProfile {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'instructor' | 'admin';
  profileImage?: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  time: string;
  read: boolean;
}

class UserService {
  private mockUserProfile: UserProfile = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    role: 'student',
    profileImage: ''
  };

  private mockNotifications: Notification[] = [
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

  async getProfile(userId: number): Promise<UserProfile> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 300));
    return { ...this.mockUserProfile, id: userId };
  }

  async getUserNotifications(userId: number): Promise<Notification[]> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 500));
    return this.mockNotifications.map(notif => ({ ...notif }));
  }

  async markNotificationAsRead(userId: number, notificationId: number): Promise<void> {
    // Simuler un délai réseau
    await new Promise(resolve => setTimeout(resolve, 200));
    const notification = this.mockNotifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }
}

export default new UserService();