import React from "react";
import { useApp } from "../context/AppContext";
import {
  Flame,
  Star,
  Trophy,
  TrendingUp,
  Brain,
  Sparkles,
  CheckCircle2,
  Clock,
  ChevronRight,
  Shield,
  Smartphone,
  Swords,
  Timer,
  AlertCircle,
  Calendar,
} from "lucide-react";

export const DashboardView: React.FC = () => {
  const {
    profile,
    challenges,
    tasks,
    calendarEvents,
    setActiveTab,
    setFocusTimerOpen,
    setBossBattleOpen,
    buyStreakProtection,
    toggleTaskStatus,
    completeChallenge,
  } = useApp();

  if (!profile) return null;

  const dailyChallenge = challenges.find((c) => c.type === "diario") || challenges[0];
  const pendingTasks = tasks.filter((t) => t.status !== "Completada").slice(0, 3);
  const nextExam = calendarEvents.find((e) => e.type === "Examen") || calendarEvents[0];

  // Screen time calculations
  const hours = Math.floor(profile.screenTimeMinutesToday / 60);
  const minutes = profile.screenTimeMinutesToday % 60;
  const limitHours = Math.floor(profile.screenTimeLimitMinutes / 60);
  const limitMinutes = profile.screenTimeLimitMinutes % 60;
  const screenTimePercent = Math.min(
    100,
    Math.round((profile.screenTimeMinutesToday / profile.screenTimeLimitMinutes) * 100)
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Greeting & Level Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-500 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white/90">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Estudiante de 6.º de Primaria</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white font-heading">
              ¡Hola, {profile.name}! 👋
            </h1>
            <p className="text-blue-100 text-sm sm:text-base max-w-xl">
              Hoy es un gran día para aprender, superar tus marcas y ganar PapelPuntos para tus recompensas familiares.
            </p>
          </div>

          {/* Quick Action Badges */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setFocusTimerOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs sm:text-sm font-bold shadow-xs transition-all"
            >
              <Timer className="w-4 h-4 text-amber-300" />
              <span>Modo Concentración</span>
            </button>
            <button
              onClick={() => setBossBattleOpen(true)}
              className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-rose-400 hover:opacity-95 text-slate-900 text-xs sm:text-sm font-extrabold shadow-md transition-all"
            >
              <Swords className="w-4 h-4 text-slate-900" />
              <span>Boss de Matemática</span>
            </button>
          </div>
        </div>

        {/* Gamification Stats Strip */}
        <div className="mt-8 pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-amber-400/30 flex items-center justify-center">
              <Flame className="w-6 h-6 text-amber-300 fill-amber-400" />
            </div>
            <div>
              <p className="text-xs text-blue-100 font-medium">Racha de estudio</p>
              <p className="text-lg font-black text-white">{profile.streakDays} días</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-indigo-400/30 flex items-center justify-center">
              <Star className="w-6 h-6 text-yellow-300 fill-yellow-400" />
            </div>
            <div>
              <p className="text-xs text-blue-100 font-medium">Nivel actual</p>
              <p className="text-lg font-black text-white">Nivel {profile.level}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-emerald-400/30 flex items-center justify-center">
              <Trophy className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <p className="text-xs text-blue-100 font-medium">PapelPuntos</p>
              <p className="text-lg font-black text-white">{profile.papelPuntos} pts</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-xs p-3.5 rounded-2xl">
            <div className="w-10 h-10 rounded-xl bg-sky-400/30 flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-sky-200" />
            </div>
            <div>
              <p className="text-xs text-blue-100 font-medium">Progreso semanal</p>
              <p className="text-lg font-black text-white">{profile.weeklyProgressPercent} %</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Reto del día + Recomendación IA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Reto del Día Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Flame className="w-4 h-4 fill-amber-500 text-amber-600" />
              </div>
              <h2 className="font-extrabold text-slate-900 text-base">Reto del día</h2>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-200 rounded-full">
              +{dailyChallenge.xpReward} XP | +{dailyChallenge.puntosReward} pts
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 mb-4">
            <p className="font-bold text-slate-800 text-base mb-1">
              “{dailyChallenge.description}”
            </p>
            <div className="flex items-center justify-between text-xs text-slate-500 mt-3">
              <span>Progreso: {dailyChallenge.currentCount}/{dailyChallenge.targetCount} preguntas</span>
              <span className="font-semibold text-amber-700">
                {Math.round((dailyChallenge.currentCount / dailyChallenge.targetCount) * 100)}%
              </span>
            </div>
            <div className="w-full bg-amber-200/60 rounded-full h-2 mt-1.5 overflow-hidden">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                style={{
                  width: `${(dailyChallenge.currentCount / dailyChallenge.targetCount) * 100}%`,
                }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab("quizzes")}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>Ir a cuestionarios de {dailyChallenge.course || "Matemática"}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            {!dailyChallenge.isCompleted ? (
              <button
                onClick={() => completeChallenge(dailyChallenge.id)}
                className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Completar
              </button>
            ) : (
              <span className="flex items-center text-xs font-bold text-emerald-600 space-x-1">
                <CheckCircle2 className="w-4 h-4" />
                <span>¡Completado!</span>
              </span>
            )}
          </div>
        </div>

        {/* Recomendación IA Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                <Brain className="w-4 h-4" />
              </div>
              <h2 className="font-extrabold text-slate-900 text-base">Recomendación IA</h2>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-200">
              Personalizado
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-100 mb-4">
            <p className="text-slate-800 text-sm font-medium leading-relaxed">
              💡 “Hoy deberías practicar <strong>fracciones</strong> durante 15 minutos. Te ayudará a resolver tu tarea pendiente y llegar con seguridad a tu examen.”
            </p>
            <div className="mt-3 flex items-center space-x-2 text-xs text-blue-700">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <span>Basado en tus últimos cuestionarios de Matemática</span>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={() => setActiveTab("ai-tutor")}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>Preguntar a MendelMind IA</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab("quizzes")}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
            >
              Practicar ahora
            </button>
          </div>
        </div>

        {/* Screen Time Quick Status */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <Smartphone className="w-4 h-4" />
              </div>
              <h2 className="font-extrabold text-slate-900 text-base">Tiempo de Pantalla</h2>
            </div>
            <button
              onClick={() => setActiveTab("progress")}
              className="text-xs font-bold text-blue-600 hover:underline"
            >
              Ver apps
            </button>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-4">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black text-slate-900">
                  {hours} h {minutes} min
                </span>
                <span className="text-xs text-slate-500 ml-1.5">
                  / meta {limitHours} h {limitMinutes > 0 ? `${limitMinutes}m` : ""}
                </span>
              </div>
              <span className="text-xs font-extrabold text-emerald-600 bg-emerald-100/80 px-2 py-0.5 rounded-md">
                -15% vs sem. pasada
              </span>
            </div>

            <div className="w-full bg-slate-200 rounded-full h-2.5 mt-3 overflow-hidden">
              <div
                className={`h-2.5 rounded-full transition-all duration-500 ${
                  screenTimePercent > 90 ? "bg-amber-500" : "bg-emerald-500"
                }`}
                style={{ width: `${screenTimePercent}%` }}
              />
            </div>
            <p className="text-[11px] text-slate-500 mt-2">
              Te quedan {Math.max(0, profile.screenTimeLimitMinutes - profile.screenTimeMinutesToday)} minutos para cumplir tu objetivo familiar.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={buyStreakProtection}
              className="text-xs font-bold text-slate-700 hover:text-blue-600 flex items-center space-x-1.5"
            >
              <Shield className="w-3.5 h-3.5 text-blue-500" />
              <span>Protector de Racha (100 pts)</span>
            </button>
            <span className="text-xs font-semibold text-emerald-700">
              {profile.streakFrozen ? "🛡️ Blindado" : "Disponible"}
            </span>
          </div>
        </div>
      </div>

      {/* Second Row: Próximas Tareas & Exámenes + Quick Access Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Próximas Tareas */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-extrabold text-slate-900 text-lg">Próximas Tareas</h2>
                <p className="text-xs text-slate-500">Gana +30 XP y PapelPuntos al entregarlas a tiempo</p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("tasks")}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>Ver todas ({tasks.length})</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors flex items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-3">
                  <button
                    onClick={() => toggleTaskStatus(task.id)}
                    className="mt-0.5 w-5 h-5 rounded-lg border-2 border-slate-300 hover:border-blue-500 flex items-center justify-center transition-colors focus:outline-hidden"
                  >
                    {task.status === "Completada" && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
                  </button>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800">
                        {task.course}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                          task.priority === "Alta"
                            ? "bg-rose-100 text-rose-700"
                            : task.priority === "Media"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-600"
                        }`}
                      >
                        Prioridad {task.priority}
                      </span>
                    </div>
                    <p className="font-bold text-slate-900 text-sm mt-1">{task.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{task.description}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="flex items-center space-x-1 text-xs text-slate-500 justify-end">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{task.dueDate}</span>
                  </div>
                  <span className="inline-block mt-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                    +{task.xpReward} XP | +{task.puntosReward} pts
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Exam Alert banner */}
          {nextExam && (
            <div className="mt-4 p-4 rounded-2xl bg-amber-50 border border-amber-200/80 flex items-start space-x-3">
              <Calendar className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-extrabold text-amber-900 uppercase tracking-wide">
                    Próximo examen importante
                  </p>
                  <span className="text-xs font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded-md">
                    En {nextExam.daysRemaining} días
                  </span>
                </div>
                <p className="text-sm font-bold text-amber-950 mt-0.5">{nextExam.title}</p>
                <p className="text-xs text-amber-800 mt-1">
                  {nextExam.aiRecommendation}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Quick Features Bento */}
        <div className="space-y-4">
          {/* Cuestionarios IA Card */}
          <div
            onClick={() => setActiveTab("quizzes")}
            className="group cursor-pointer p-5 rounded-3xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-md hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white/20 text-white">
                Generador IA
              </span>
            </div>
            <h3 className="font-extrabold text-lg text-white">Crear Cuestionario IA</h3>
            <p className="text-xs text-blue-100 mt-1">
              Elige materia y dificultad. La IA creará preguntas interactivas al instante.
            </p>
            <div className="mt-4 flex items-center text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
              <span>Empezar cuestionario</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Recompensas Card */}
          <div
            onClick={() => setActiveTab("rewards")}
            className="group cursor-pointer p-5 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                <Trophy className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-white/20 text-white">
                {profile.papelPuntos} pts disponibles
              </span>
            </div>
            <h3 className="font-extrabold text-lg text-white">Canjear Recompensas</h3>
            <p className="text-xs text-emerald-100 mt-1">
              Horas de celular, noche de películas, avatares o juegos con aprobación de tus padres.
            </p>
            <div className="mt-4 flex items-center text-xs font-bold text-white group-hover:translate-x-1 transition-transform">
              <span>Ver catálogo familiar</span>
              <ChevronRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Boss Final banner */}
          <div
            onClick={() => setBossBattleOpen(true)}
            className="group cursor-pointer p-5 rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white shadow-md hover:shadow-lg transition-all"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center">
                <Swords className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-black px-2.5 py-1 rounded-full bg-white/30 text-white uppercase tracking-wider">
                👑 BOSS FINAL
              </span>
            </div>
            <h3 className="font-extrabold text-lg text-white">Boss de Matemática</h3>
            <p className="text-xs text-amber-100 mt-1">
              Desafío integral de 10 preguntas. ¡Vence al guardián para ganar +250 XP y un avatar legendario!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
