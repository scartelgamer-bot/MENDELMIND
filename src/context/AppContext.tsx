import React, { createContext, useContext, useState, useEffect } from "react";
import confetti from "canvas-confetti";
import {
  StudentProfile,
  SchoolTask,
  CalendarEvent,
  RewardItem,
  Challenge,
  BadgeItem,
  ScreenTimeHistory,
  CourseMastery,
  StudyPlan,
  QuizResult,
  CourseName,
} from "../types";
import {
  initialProfile,
  initialTasks,
  initialCalendarEvents,
  initialRewards,
  initialChallenges,
  initialBadges,
  initialScreenTime,
  initialMastery,
  initialStudyPlan,
  initialQuizResults,
} from "../data/initialData";

export interface RegisteredUser {
  email: string;
  password?: string;
  profile: StudentProfile;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: "xp" | "puntos" | "level" | "info" | "success";
}

interface AppContextType {
  // Auth
  profile: StudentProfile | null;
  isLoggedIn: boolean;
  isParentMode: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  loginDemo: () => void;
  loginAsDemo: () => void;
  login: (email: string, pass: string) => boolean;
  register: (data: Partial<StudentProfile>, password?: string) => void;
  logout: () => void;
  registeredUsers: RegisteredUser[];
  setIsParentMode: (val: boolean) => void;
  toggleParentModeWithPin: (pin: string) => boolean;

  // Gamification & Stats
  addXP: (amount: number, reason: string) => void;
  addPapelPuntos: (amount: number, reason: string) => void;
  buyStreakProtection: () => boolean;
  updateProfileAvatar: (avatarId: string, avatarName: string) => void;

  // Tasks
  tasks: SchoolTask[];
  toggleTaskStatus: (id: string) => void;
  addTask: (task: Omit<SchoolTask, "id">) => void;
  deleteTask: (id: string) => void;

  // Quizzes & Results
  quizResults: QuizResult[];
  quizHistory: QuizResult[];
  recordQuizResult: (result: QuizResult) => void;

  // Rewards
  rewards: RewardItem[];
  requestReward: (id: string) => void;
  parentApproveReward: (id: string, approve: boolean) => void;
  approveReward: (id: string) => void;
  rejectReward: (id: string) => void;
  claimReward: (id: string) => void;
  addCustomReward: (title: string, description: string, costPuntos: number) => void;
  createCustomReward: (data: { title: string; description: string; costPuntos: number; category?: any; icon?: string }) => void;

  // Challenges & Badges
  challenges: Challenge[];
  badges: BadgeItem[];
  completeChallenge: (challengeId: string) => void;

  // Mastery & Study Plan
  mastery: CourseMastery[];
  studyPlan: StudyPlan;
  setStudyPlan: (plan: StudyPlan) => void;
  toggleStudyPlanDay: (index: number) => void;

  // Calendar
  calendarEvents: CalendarEvent[];
  addCalendarEvent: (event: Omit<CalendarEvent, "id">) => void;

  // Screen Time
  screenTimeHistory: ScreenTimeHistory[];
  screenTimeApps: {
    name: string;
    appName: string;
    category: string;
    minutesToday: number;
    durationMinutes: number;
    icon: string;
    color: string;
  }[];
  updateScreenTimeLimit: (limitMinutes: number) => void;

  // Modals & Timers
  focusTimerOpen: boolean;
  isFocusTimerOpen: boolean;
  setFocusTimerOpen: (open: boolean) => void;
  bossBattleOpen: boolean;
  isBossBattleOpen: boolean;
  setBossBattleOpen: (open: boolean) => void;
  authModalOpen: boolean;
  isAuthModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalInitialMode: "login" | "register" | "demo";
  setAuthModalInitialMode: (mode: "login" | "register" | "demo") => void;

  // Feedback Notifications
  notifications: AppNotification[];
  removeNotification: (id: string) => void;
  triggerCelebration: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LEVEL_THRESHOLDS = [
  { level: 1, title: "Explorador", minXp: 0, maxXp: 300 },
  { level: 2, title: "Aprendiz", minXp: 300, maxXp: 700 },
  { level: 3, title: "Estudiante", minXp: 700, maxXp: 1300 },
  { level: 4, title: "Estudiante destacado", minXp: 1300, maxXp: 2100 },
  { level: 5, title: "Experto", minXp: 2100, maxXp: 3000 },
  { level: 6, title: "Maestro del conocimiento", minXp: 3000, maxXp: 4000 },
  { level: 7, title: "Maestro del conocimiento", minXp: 4000, maxXp: 5200 },
  { level: 8, title: "Maestro del conocimiento", minXp: 5200, maxXp: 6500 },
  { level: 9, title: "Sabio de MendelMind", minXp: 6500, maxXp: 8000 },
  { level: 10, title: "Leyenda MendelMind", minXp: 8000, maxXp: 10000 },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load from localStorage or defaults
  const [profile, setProfile] = useState<StudentProfile | null>(() => {
    const saved = localStorage.getItem("mendelmind_profile");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return initialProfile;
      }
    }
    return initialProfile; // Default to demo loaded for immediate rich presentation
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem("mendelmind_logged_in") !== "false";
  });

  const [registeredUsers, setRegisteredUsers] = useState<RegisteredUser[]>(() => {
    const saved = localStorage.getItem("mendelmind_registered_users");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return [
      {
        email: "demo@mendelmind.com",
        password: "123",
        profile: initialProfile,
      },
    ];
  });

  const [isParentMode, setIsParentMode] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  const [tasks, setTasks] = useState<SchoolTask[]>(() => {
    const saved = localStorage.getItem("mendelmind_tasks");
    return saved ? JSON.parse(saved) : initialTasks;
  });

  const [rewards, setRewards] = useState<RewardItem[]>(() => {
    const saved = localStorage.getItem("mendelmind_rewards");
    return saved ? JSON.parse(saved) : initialRewards;
  });

  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem("mendelmind_challenges");
    return saved ? JSON.parse(saved) : initialChallenges;
  });

  const [badges, setBadges] = useState<BadgeItem[]>(() => {
    const saved = localStorage.getItem("mendelmind_badges");
    return saved ? JSON.parse(saved) : initialBadges;
  });

  const [mastery, setMastery] = useState<CourseMastery[]>(() => {
    const saved = localStorage.getItem("mendelmind_mastery");
    return saved ? JSON.parse(saved) : initialMastery;
  });

  const [studyPlan, setStudyPlanState] = useState<StudyPlan>(() => {
    const saved = localStorage.getItem("mendelmind_study_plan");
    return saved ? JSON.parse(saved) : initialStudyPlan;
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem("mendelmind_calendar");
    return saved ? JSON.parse(saved) : initialCalendarEvents;
  });

  const [screenTimeHistory, setScreenTimeHistory] = useState<ScreenTimeHistory[]>(() => {
    const saved = localStorage.getItem("mendelmind_screentime");
    return saved ? JSON.parse(saved) : initialScreenTime;
  });

  const [quizResults, setQuizResults] = useState<QuizResult[]>(() => {
    const saved = localStorage.getItem("mendelmind_quiz_results");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        // fallback
      }
    }
    return initialQuizResults;
  });

  // Modal states
  const [focusTimerOpen, setFocusTimerOpen] = useState(false);
  const [bossBattleOpen, setBossBattleOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalInitialMode, setAuthModalInitialMode] = useState<"login" | "register" | "demo">("login");
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // Sync to localStorage
  useEffect(() => {
    if (profile) localStorage.setItem("mendelmind_profile", JSON.stringify(profile));
    localStorage.setItem("mendelmind_logged_in", isLoggedIn ? "true" : "false");
  }, [profile, isLoggedIn]);

  useEffect(() => {
    localStorage.setItem("mendelmind_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("mendelmind_rewards", JSON.stringify(rewards));
  }, [rewards]);

  useEffect(() => {
    localStorage.setItem("mendelmind_mastery", JSON.stringify(mastery));
  }, [mastery]);

  useEffect(() => {
    localStorage.setItem("mendelmind_study_plan", JSON.stringify(studyPlan));
  }, [studyPlan]);

  const addNotification = (notif: Omit<AppNotification, "id">) => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setNotifications((prev) => [...prev, { ...notif, id }]);
    setTimeout(() => {
      removeNotification(id);
    }, 4500);
  };

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#3B82F6", "#10B981", "#F59E0B", "#EC4899", "#8B5CF6"],
      });
    } catch (e) {
      // safe fallback
    }
  };

  // Gamification: Add XP & calculate level
  const addXP = (amount: number, reason: string) => {
    if (!profile) return;
    setProfile((prev) => {
      if (!prev) return prev;
      const newXp = prev.xp + amount;
      let newLevel = prev.level;
      let newTitle = prev.levelTitle;

      const currentThreshold = LEVEL_THRESHOLDS.find((t) => t.level === newLevel);
      if (currentThreshold && newXp >= currentThreshold.maxXp) {
        newLevel += 1;
        const nextThreshold = LEVEL_THRESHOLDS.find((t) => t.level === newLevel);
        if (nextThreshold) newTitle = nextThreshold.title;

        triggerCelebration();
        addNotification({
          title: "¡SUBISTE DE NIVEL! ⭐",
          message: `¡Felicitaciones! Ahora eres Nivel ${newLevel}: ${newTitle}`,
          type: "level",
        });
      }

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        levelTitle: newTitle,
      };
    });

    addNotification({
      title: `+${amount} XP`,
      message: reason,
      type: "xp",
    });
  };

  // Gamification: Add PapelPuntos
  const addPapelPuntos = (amount: number, reason: string) => {
    if (!profile) return;
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        papelPuntos: prev.papelPuntos + amount,
      };
    });

    addNotification({
      title: `+${amount} PapelPuntos 🏆`,
      message: reason,
      type: "puntos",
    });
  };

  // Streak Protection purchase
  const buyStreakProtection = () => {
    if (!profile) return false;
    if (profile.papelPuntos < 100) {
      addNotification({
        title: "Puntos insuficientes",
        message: "Necesitas 100 PapelPuntos para activar la Protección de Racha.",
        type: "info",
      });
      return false;
    }
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        papelPuntos: prev.papelPuntos - 100,
        streakFrozen: true,
      };
    });
    addNotification({
      title: "🛡️ ¡Protector de Racha Activado!",
      message: "Tu racha está blindada si no puedes conectarte un día.",
      type: "success",
    });
    return true;
  };

  // Profile avatar update
  const updateProfileAvatar = (avatarId: string, avatarName: string) => {
    if (!profile) return;
    setProfile((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        avatarId,
        avatarName,
      };
    });
    addNotification({
      title: "Avatar actualizado",
      message: `Ahora luces tu avatar: ${avatarName}`,
      type: "success",
    });
  };

  // Tasks Management
  const toggleTaskStatus = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const isCompleting = t.status !== "Completada";
          const newStatus = isCompleting ? "Completada" : "Pendiente";

          if (isCompleting) {
            addXP(t.xpReward, `Tarea completada: ${t.title}`);
            addPapelPuntos(t.puntosReward, `Premio por cumplir tarea a tiempo`);
            triggerCelebration();
          }

          return { ...t, status: newStatus };
        }
        return t;
      })
    );
  };

  const addTask = (taskData: Omit<SchoolTask, "id">) => {
    const newTask: SchoolTask = {
      ...taskData,
      id: "task-" + Date.now(),
    };
    setTasks((prev) => [newTask, ...prev]);
    addNotification({
      title: "Tarea guardada",
      message: `"${newTask.title}" agregada a tus pendientes.`,
      type: "info",
    });
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  // Rewards Management
  const requestReward = (id: string) => {
    const item = rewards.find((r) => r.id === id);
    if (!item || !profile) return;

    if (profile.papelPuntos < item.costPuntos) {
      addNotification({
        title: "PapelPuntos insuficientes",
        message: `Te faltan ${item.costPuntos - profile.papelPuntos} PapelPuntos para canjear este premio.`,
        type: "info",
      });
      return;
    }

    if (item.category === "digital") {
      // Instant unlock for digital items
      setProfile((prev) => prev ? { ...prev, papelPuntos: prev.papelPuntos - item.costPuntos } : prev);
      setRewards((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "canjeada" } : r))
      );
      triggerCelebration();
      addNotification({
        title: "🎉 ¡Recompensa Digital Desbloqueada!",
        message: `Has desbloqueado: ${item.title}`,
        type: "success",
      });
    } else {
      // Real life parental reward: Requires approval!
      setRewards((prev) =>
        prev.map((r) =>
          r.id === id
            ? { ...r, status: "solicitada", requestedDate: "Hoy, " + new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }
            : r
        )
      );
      addNotification({
        title: "Solicitud enviada a tus padres 📬",
        message: `Tu papá o mamá revisará "${item.title}" en su panel de Control Parental.`,
        type: "info",
      });
    }
  };

  const parentApproveReward = (id: string, approve: boolean) => {
    const item = rewards.find((r) => r.id === id);
    if (!item) return;

    if (approve) {
      // Deduct points from student
      if (profile && profile.papelPuntos >= item.costPuntos) {
        setProfile((prev) => prev ? { ...prev, papelPuntos: prev.papelPuntos - item.costPuntos } : prev);
      }
      setRewards((prev) =>
        prev.map((r) =>
          r.id === id
            ? {
                ...r,
                status: "aprobada",
                approvedDate: "Aprobado por " + (profile?.parentName || "Tutor"),
              }
            : r
        )
      );
      addNotification({
        title: "Recompensa Aprobada ✅",
        message: `Se aprobó "${item.title}" para el estudiante.`,
        type: "success",
      });
    } else {
      setRewards((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status: "rechazada" } : r))
      );
      addNotification({
        title: "Recompensa no aprobada",
        message: `La solicitud fue rechazada o pospuesta.`,
        type: "info",
      });
    }
  };

  const claimReward = (id: string) => {
    setRewards((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "canjeada" } : r))
    );
    addNotification({
      title: "¡Premio Disfrutado!",
      message: "¡Que disfrutes tu recompensa bien merecida!",
      type: "success",
    });
  };

  const addCustomReward = (title: string, description: string, costPuntos: number) => {
    const newRew: RewardItem = {
      id: "rew-" + Date.now(),
      title,
      description,
      costPuntos,
      category: "real_parental",
      status: "disponible",
      icon: "gift",
      parentApprovalRequired: true,
    };
    setRewards((prev) => [newRew, ...prev]);
    addNotification({
      title: "Nueva recompensa creada 🎁",
      message: `"${title}" agregada al catálogo de premios.`,
      type: "success",
    });
  };

  // Challenges
  const completeChallenge = (challengeId: string) => {
    setChallenges((prev) =>
      prev.map((ch) => {
        if (ch.id === challengeId && !ch.isCompleted) {
          addXP(ch.xpReward, `Reto completado: ${ch.title}`);
          addPapelPuntos(ch.puntosReward, `Premio por cumplir reto`);
          if (ch.badgeReward) {
            // Unlock badge
            setBadges((bList) =>
              bList.map((b) =>
                b.title.toLowerCase().includes(ch.badgeReward!.toLowerCase())
                  ? { ...b, unlocked: true, unlockedDate: "¡Hoy!" }
                  : b
              )
            );
          }
          triggerCelebration();
          return { ...ch, isCompleted: true, currentCount: ch.targetCount };
        }
        return ch;
      })
    );
  };

  // Record Quiz Result & Dynamically update Knowledge Mastery
  const recordQuizResult = (result: QuizResult) => {
    setQuizResults((prev) => [result, ...prev]);
    addXP(result.xpEarned, `Cuestionario de ${result.course} (${result.percentage}%)`);
    addPapelPuntos(result.papelPuntosEarned, `Respuestas correctas de ${result.course}`);

    // Update Knowledge Mastery
    setMastery((prev) => {
      return prev.map((c) => {
        if (c.course === result.course) {
          // Check if topic matches or add/update
          const existingTopic = c.topics.find(
            (t) => t.topic.toLowerCase() === result.topic.toLowerCase()
          );

          if (existingTopic) {
            const newScore = Math.round((existingTopic.scorePercent + result.percentage) / 2);
            const newLevel = newScore >= 85 ? "dominado" : newScore >= 70 ? "practica" : "reforzar";
            return {
              ...c,
              topics: c.topics.map((t) =>
                t.topic.toLowerCase() === result.topic.toLowerCase()
                  ? { ...t, scorePercent: newScore, level: newLevel }
                  : t
              ),
            };
          } else {
            const newLevel = result.percentage >= 85 ? "dominado" : result.percentage >= 70 ? "practica" : "reforzar";
            return {
              ...c,
              topics: [
                ...c.topics,
                { topic: result.topic, level: newLevel, scorePercent: result.percentage },
              ],
            };
          }
        }
        return c;
      });
    });

    if (result.percentage === 100) {
      // Check 10/10 badge
      setBadges((prev) =>
        prev.map((b) => (b.id === "badge-7" ? { ...b, unlocked: true } : b))
      );
    }
  };

  // Study Plan
  const setStudyPlan = (plan: StudyPlan) => {
    setStudyPlanState(plan);
    addNotification({
      title: "Plan Inteligente Actualizado 📅",
      message: "Tu semana se ha organizado con la ayuda de MendelMind IA.",
      type: "success",
    });
  };

  const toggleStudyPlanDay = (index: number) => {
    setStudyPlanState((prev) => {
      const updated = { ...prev };
      const day = updated.dailySchedule[index];
      if (day) {
        day.completed = !day.completed;
        if (day.completed) {
          addXP(20, `Sesión de estudio del día: ${day.day}`);
        }
      }
      return updated;
    });
  };

  // Calendar
  const addCalendarEvent = (eventData: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: "cal-" + Date.now(),
    };
    setCalendarEvents((prev) => [...prev, newEvent]);
    addNotification({
      title: "Fecha añadida al calendario",
      message: `"${newEvent.title}" registrada con éxito.`,
      type: "info",
    });
  };

  // Screen Time Limit
  const updateScreenTimeLimit = (limitMinutes: number) => {
    if (!profile) return;
    setProfile((prev) => (prev ? { ...prev, screenTimeLimitMinutes: limitMinutes } : prev));
    addNotification({
      title: "Límite de tiempo actualizado",
      message: `Límite diario fijado en ${Math.floor(limitMinutes / 60)}h ${limitMinutes % 60}m.`,
      type: "info",
    });
  };

  // Authentication Handlers
  const loginDemo = () => {
    setProfile(initialProfile);
    setIsLoggedIn(true);
    setIsParentMode(false);
    setAuthModalOpen(false);
    setActiveTab("dashboard");
    triggerCelebration();
    addNotification({
      title: "¡Bienvenido a MendelMind Demo! 🚀",
      message: "Sesión iniciada con la cuenta de Mateo (6.º de Primaria).",
      type: "success",
    });
  };

  const login = (email: string, pass: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) return false;

    // Check demo credentials
    if (cleanEmail === "demo@mendelmind.com" || cleanEmail === "mateo@mendelmind.com" || cleanEmail === "demo") {
      setProfile(initialProfile);
      setIsLoggedIn(true);
      setIsParentMode(false);
      setAuthModalOpen(false);
      setActiveTab("dashboard");
      triggerCelebration();
      addNotification({
        title: "¡Bienvenido, Mateo! 🚀",
        message: "Sesión iniciada con tu cuenta de 6.º de Primaria.",
        type: "success",
      });
      return true;
    }

    // Check registered accounts
    const matched = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (matched) {
      setProfile(matched.profile);
      setIsLoggedIn(true);
      setIsParentMode(false);
      setAuthModalOpen(false);
      setActiveTab("dashboard");
      triggerCelebration();
      addNotification({
        title: `¡Hola de nuevo, ${matched.profile.name}! 👋`,
        message: "Has iniciado sesión correctamente.",
        type: "success",
      });
      return true;
    }

    // If valid email format is provided, allow auto-creation/login
    if (cleanEmail.includes("@")) {
      const extractedName = cleanEmail.split("@")[0].replace(/[._-]/g, " ");
      const capitalized = extractedName.charAt(0).toUpperCase() + extractedName.slice(1);
      register(
        {
          name: capitalized || "Estudiante",
          email: cleanEmail,
        },
        pass
      );
      return true;
    }

    return false;
  };

  const register = (data: Partial<StudentProfile>, password?: string) => {
    const cleanEmail = (data.email || `estudiante_${Date.now()}@mendelmind.com`).trim().toLowerCase();
    const studentName = data.name?.trim() || "Estudiante";

    const newStudent: StudentProfile = {
      ...initialProfile,
      id: "student-" + Date.now(),
      name: studentName,
      lastName: data.lastName?.trim() || "",
      email: cleanEmail,
      age: data.age || 11,
      grade: data.grade || "6.º de Primaria",
      parentName: data.parentName?.trim() || "Tutor",
      parentEmail: data.parentEmail?.trim() || "tutor@email.com",
      courses: data.courses || initialProfile.courses,
      avatarId: "cosmo-owl",
      avatarName: "Búho Sabio",
      profileBackground: "gradient-indigo",
      level: 1,
      levelTitle: "Novato",
      xp: 100,
      xpToNextLevel: 300,
      papelPuntos: 150, // Bono de bienvenida
      streakDays: 1,
      streakFrozen: false,
      weeklyProgressPercent: 10,
      focusMinutesToday: 0,
      screenTimeMinutesToday: 30,
      screenTimeLimitMinutes: 180,
    };

    const newAccount: RegisteredUser = {
      email: cleanEmail,
      password: password || "123456",
      profile: newStudent,
    };

    setRegisteredUsers((prev) => {
      const filtered = prev.filter((u) => u.email.toLowerCase() !== cleanEmail);
      const updated = [...filtered, newAccount];
      localStorage.setItem("mendelmind_registered_users", JSON.stringify(updated));
      return updated;
    });

    setProfile(newStudent);
    setIsLoggedIn(true);
    setIsParentMode(false);
    setAuthModalOpen(false);
    setActiveTab("dashboard");
    triggerCelebration();
    addNotification({
      title: "¡Cuenta Creada con Éxito! 🎉",
      message: `¡Bienvenido(a), ${newStudent.name}! Recibiste 150 PapelPuntos de regalo de bienvenida.`,
      type: "success",
    });
  };

  const logout = () => {
    setIsLoggedIn(false);
    setIsParentMode(false);
    setActiveTab("dashboard");
    addNotification({
      title: "Sesión cerrada",
      message: "Vuelve pronto a practicar en MendelMind.",
      type: "info",
    });
  };

  const toggleParentModeWithPin = (pin: string): boolean => {
    if (pin === "1234" || pin === "") {
      setIsParentMode((prev) => !prev);
      return true;
    }
    return false;
  };

  const approveReward = (id: string) => parentApproveReward(id, true);
  const rejectReward = (id: string) => parentApproveReward(id, false);
  const createCustomReward = (data: { title: string; description: string; costPuntos: number; category?: any; icon?: string }) => {
    addCustomReward(data.title, data.description, data.costPuntos);
  };
  const loginAsDemo = loginDemo;

  const screenTimeApps = (screenTimeHistory[0]?.apps || []).map((app) => ({
    ...app,
    name: app.appName,
    minutesToday: app.durationMinutes,
  }));

  return (
    <AppContext.Provider
      value={{
        profile,
        isLoggedIn,
        isParentMode,
        activeTab,
        setActiveTab,
        loginDemo,
        loginAsDemo,
        login,
        register,
        logout,
        registeredUsers,
        setIsParentMode,
        toggleParentModeWithPin,
        addXP,
        addPapelPuntos,
        buyStreakProtection,
        updateProfileAvatar,
        tasks,
        toggleTaskStatus,
        addTask,
        deleteTask,
        quizResults,
        quizHistory: quizResults,
        recordQuizResult,
        rewards,
        requestReward,
        parentApproveReward,
        approveReward,
        rejectReward,
        claimReward,
        addCustomReward,
        createCustomReward,
        challenges,
        badges,
        completeChallenge,
        mastery,
        studyPlan,
        setStudyPlan,
        toggleStudyPlanDay,
        calendarEvents,
        addCalendarEvent,
        screenTimeHistory,
        screenTimeApps,
        updateScreenTimeLimit,
        focusTimerOpen,
        isFocusTimerOpen: focusTimerOpen,
        setFocusTimerOpen,
        bossBattleOpen,
        isBossBattleOpen: bossBattleOpen,
        setBossBattleOpen,
        authModalOpen,
        isAuthModalOpen: authModalOpen,
        setAuthModalOpen,
        authModalInitialMode,
        setAuthModalInitialMode,
        notifications,
        removeNotification,
        triggerCelebration,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within an AppProvider");
  return context;
};
