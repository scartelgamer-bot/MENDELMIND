export type CourseName =
  | "Matemática"
  | "Comunicación"
  | "Ciencia y Tecnología"
  | "Personal Social"
  | "Inglés"
  | "Educación Física"
  | "Arte y Cultura";

export interface StudentProfile {
  id: string;
  name: string;
  lastName: string;
  email: string;
  age: number;
  grade: string;
  parentName: string;
  parentEmail: string;
  courses: CourseName[];
  avatarId: string;
  avatarName: string;
  profileBackground: string;
  level: number;
  levelTitle: string;
  xp: number;
  xpToNextLevel: number;
  papelPuntos: number;
  streakDays: number;
  streakFrozen: boolean;
  weeklyProgressPercent: number;
  focusMinutesToday: number;
  screenTimeMinutesToday: number;
  screenTimeLimitMinutes: number;
}

export type QuestionType =
  | "multiple_choice"
  | "true_false"
  | "fill_blank"
  | "short_answer"
  | "matching";

export interface QuizQuestion {
  id: number | string;
  type: QuestionType;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface QuizResult {
  id: string;
  course: CourseName;
  topic: string;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  percentage: number;
  timeSpentSeconds: number;
  xpEarned: number;
  papelPuntosEarned: number;
  date: string;
  weakTopics: string[];
  answersReview: {
    question: string;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string;
  }[];
}

export type TaskPriority = "Alta" | "Media" | "Baja";
export type TaskStatus = "Pendiente" | "En progreso" | "Completada";

export interface SchoolTask {
  id: string;
  title: string;
  course: CourseName;
  description: string;
  dueDate: string;
  priority: TaskPriority;
  status: TaskStatus;
  xpReward: number;
  puntosReward: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  course: CourseName;
  type: "Examen" | "Tarea" | "Exposición" | "Proyecto" | "Fecha Importante";
  date: string;
  daysRemaining: number;
  aiRecommendation?: string;
}

export type RewardCategory = "digital" | "real_parental";
export type RewardStatus = "disponible" | "solicitada" | "aprobada" | "canjeada" | "rechazada";

export interface RewardItem {
  id: string;
  title: string;
  description: string;
  costPuntos: number;
  category: RewardCategory;
  status: RewardStatus;
  icon: string;
  parentApprovalRequired: boolean;
  requestedDate?: string;
  approvedDate?: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  type: "diario" | "semanal" | "sorpresa" | "curso" | "recuperacion";
  course?: CourseName;
  targetCount: number;
  currentCount: number;
  isCompleted: boolean;
  xpReward: number;
  puntosReward: number;
  badgeReward?: string;
}

export interface BadgeItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedDate?: string;
  category: "quiz" | "racha" | "materia" | "tareas" | "especial";
}

export interface AppScreenTimeRecord {
  appName: string;
  category: "educacion" | "entretenimiento" | "comunicacion" | "juegos";
  durationMinutes: number;
  icon: string;
  color: string;
}

export interface ScreenTimeHistory {
  date: string;
  label: string; // "Hoy", "Ayer", etc.
  totalMinutes: number;
  unlocks: number;
  apps: AppScreenTimeRecord[];
  peakHour: string;
  trendVsLastWeekPercent: number; // e.g. -15%
}

export type MasteryLevel = "dominado" | "practica" | "reforzar";

export interface TopicMastery {
  topic: string;
  level: MasteryLevel; // 🟢, 🟡, 🔴
  scorePercent: number;
}

export interface CourseMastery {
  course: CourseName;
  topics: TopicMastery[];
}

export interface StudyPlanDay {
  day: string;
  course: CourseName | "Repaso general";
  topic: string;
  durationMinutes: number;
  tip: string;
  completed?: boolean;
}

export interface StudyPlan {
  id: string;
  summary: string;
  weeklyTargetMinutes: number;
  dailySchedule: StudyPlanDay[];
  generatedAt: string;
}
