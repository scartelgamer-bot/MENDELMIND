import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  TrendingUp,
  Award,
  Smartphone,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Flame,
  Star,
  MapPin,
  PieChart as PieIcon,
  BarChart2,
  ShieldCheck,
  ChevronRight,
} from "lucide-react";

export const ProgressView: React.FC = () => {
  const {
    profile,
    mastery,
    badges,
    quizHistory,
    screenTimeApps,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"general" | "map" | "screen-time" | "badges">("general");

  // Screen time stats
  const hours = Math.floor((profile?.screenTimeMinutesToday || 0) / 60);
  const minutes = (profile?.screenTimeMinutesToday || 0) % 60;
  const limitHours = Math.floor((profile?.screenTimeLimitMinutes || 180) / 60);

  // Compute total quizzes and average
  const safeQuizHistory = quizHistory || [];
  const totalQuizzes = safeQuizHistory.length;
  const avgScore =
    totalQuizzes > 0
      ? Math.round(safeQuizHistory.reduce((acc, q) => acc + (q.percentage || 0), 0) / totalQuizzes)
      : 84;

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-sky-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white">
            <TrendingUp className="w-3.5 h-3.5 text-amber-300" />
            <span>Métricas de Aprendizaje & Bienestar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading">
            Tu Progreso, Fortalezas y Hábitos
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm max-w-lg">
            Revisa cómo evolucionan tus conocimientos en 6.º de primaria, tus temas dominados y tu equilibrio digital.
          </p>
        </div>

        {/* Level Stats Pill */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-3xl shrink-0 text-center">
          <p className="text-xs text-blue-100 font-bold uppercase tracking-wider">Tu Rango</p>
          <p className="text-xl sm:text-2xl font-black text-white mt-0.5">
            {profile?.levelTitle}
          </p>
          <div className="mt-1.5 text-xs text-amber-300 font-bold">
            ⭐ Nivel {profile?.level} ({profile?.xp} XP)
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-1 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveTab("general")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "general"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Evolución Académica
        </button>
        <button
          onClick={() => setActiveTab("map")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "map"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Mapa de Conocimiento ({(mastery || []).reduce((acc, c) => acc + (c.topics?.length || 0), 0)} temas)
        </button>
        <button
          onClick={() => setActiveTab("screen-time")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "screen-time"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Tiempo de Pantalla & Apps
        </button>
        <button
          onClick={() => setActiveTab("badges")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeTab === "badges"
              ? "bg-blue-600 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Insignias y Trofeos ({(badges || []).filter((b) => b.unlocked).length}/{(badges || []).length})
        </button>
      </div>

      {/* 1. TAB: EVOLUCIÓN ACADÉMICA */}
      {activeTab === "general" && (
        <div className="space-y-6">
          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <p className="text-xs text-slate-500 font-bold">Cuestionarios Realizados</p>
              <p className="text-2xl font-black text-slate-900 mt-1">{totalQuizzes} completados</p>
              <span className="text-[11px] font-semibold text-emerald-600">+3 esta semana</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <p className="text-xs text-slate-500 font-bold">Promedio de Aciertos</p>
              <p className="text-2xl font-black text-blue-600 mt-1">{avgScore} %</p>
              <span className="text-[11px] font-semibold text-blue-600">Rendimiento destacado</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <p className="text-xs text-slate-500 font-bold">Tiempo de Estudio</p>
              <p className="text-2xl font-black text-indigo-600 mt-1">4h 25m</p>
              <span className="text-[11px] font-semibold text-indigo-600">Esta semana</span>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <p className="text-xs text-slate-500 font-bold">Racha Actual</p>
              <p className="text-2xl font-black text-amber-500 mt-1">{profile?.streakDays} días</p>
              <span className="text-[11px] font-semibold text-amber-600">¡Imparable!</span>
            </div>
          </div>

          {/* Performance by Subject */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Rendimiento por Materia (6.º de Primaria)
                </h2>
                <p className="text-xs text-slate-500">
                  Calculado a partir de tus cuestionarios, tareas y respuestas con MendelMind IA.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {(mastery || []).map((item) => {
                const computedPercent =
                  (item as any).overallPercentage ??
                  (item.topics && item.topics.length > 0
                    ? Math.round(
                        item.topics.reduce((sum, t) => sum + (t.scorePercent || 0), 0) / item.topics.length
                      )
                    : 80);
                return (
                  <div key={item.course} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-extrabold text-slate-800">{item.course}</span>
                      <span className="font-black text-slate-900">{computedPercent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                      <div
                        className={`h-3 rounded-full transition-all duration-700 ${
                          computedPercent >= 85
                            ? "bg-emerald-500"
                            : computedPercent >= 70
                            ? "bg-blue-600"
                            : "bg-amber-500"
                        }`}
                        style={{ width: `${computedPercent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100">
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1 flex items-center space-x-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Tus Mayores Fortalezas</span>
                </p>
                <p className="text-sm font-bold text-slate-900">
                  Comunicación (88%) y Ciencia y Tecnología (85%)
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Dominas la comprensión de textos y conceptos de organelos celulares.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-100">
                <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1 flex items-center space-x-1">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Área Sugerida para Reforzar</span>
                </p>
                <p className="text-sm font-bold text-slate-900">
                  Matemática: Fracciones heterogéneas (68%)
                </p>
                <p className="text-xs text-slate-600 mt-1">
                  Repasar suma y resta con diferente denominador te dará el salto a 85%.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TAB: MAPA DE CONOCIMIENTO (Section 17) */}
      {activeTab === "map" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Mapa de Conocimiento Curricular
                </h2>
                <p className="text-xs text-slate-500">
                  Visualiza qué temas dominas y cuáles necesitan un empujón de estudio.
                </p>
              </div>

              {/* Legend */}
              <div className="flex items-center space-x-3 text-xs font-bold">
                <span className="flex items-center space-x-1.5 text-emerald-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span>Dominado</span>
                </span>
                <span className="flex items-center space-x-1.5 text-amber-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>En proceso</span>
                </span>
                <span className="flex items-center space-x-1.5 text-rose-700">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Necesita refuerzo</span>
                </span>
              </div>
            </div>

            <div className="space-y-6 mt-6">
              {mastery.map((course) => (
                <div key={course.course} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-extrabold text-slate-800 text-sm">{course.course}</h3>
                    <span className="text-xs font-semibold text-slate-500">
                      {course.topics.filter((t) => t.level === "dominado").length} de {course.topics.length} dominados
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {course.topics.map((t) => {
                      const isDom = t.level === "dominado";
                      const isProc = t.level === "practica" || (t.level as string) === "en_proceso";
                      return (
                        <div
                          key={t.topic}
                          className={`p-3 rounded-2xl border flex items-center justify-between transition-colors ${
                            isDom
                              ? "bg-emerald-50/50 border-emerald-200"
                              : isProc
                              ? "bg-amber-50/50 border-amber-200"
                              : "bg-rose-50/50 border-rose-200"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <span
                              className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                                isDom
                                  ? "bg-emerald-500"
                                  : isProc
                                  ? "bg-amber-500"
                                  : "bg-rose-500"
                              }`}
                            />
                            <span className="text-xs font-bold text-slate-800">{t.topic}</span>
                          </div>
                          <span
                            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${
                              isDom
                                ? "text-emerald-700 bg-emerald-100"
                                : isProc
                                ? "text-amber-700 bg-amber-100"
                                : "text-rose-700 bg-rose-100"
                            }`}
                          >
                            {isDom ? "Dominado" : isProc ? "En Práctica" : "Refuerzo"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. TAB: TIEMPO DE PANTALLA & APPS (Section 10) */}
      {activeTab === "screen-time" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-extrabold text-slate-900">
                  Seguimiento de Tiempo de Pantalla de Hoy
                </h2>
                <p className="text-xs text-slate-500">
                  MendelMind no busca prohibirte el celular, sino ayudarte a construir un horario equilibrado.
                </p>
              </div>

              <div className="text-right">
                <span className="text-2xl font-black text-slate-900">
                  {hours} h {minutes} min
                </span>
                <span className="text-xs text-slate-500 block">
                  Límite diario: {limitHours} horas
                </span>
              </div>
            </div>

            {/* Motivational message */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-start space-x-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-emerald-900">
                  ¡Excelente administración! Tu tiempo de ocio digital disminuyó <strong>15%</strong> comparado con la semana anterior.
                </p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Estás a solo 16 minutos de completar tu meta de hoy y ganar un bono de +50 PapelPuntos.
                </p>
              </div>
            </div>

            {/* Apps Breakdown */}
            <div>
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-3">
                Distribución por Aplicación (Hoy)
              </h3>
              <div className="space-y-3">
                {(screenTimeApps || []).map((app) => {
                  const displayIcon =
                    app.icon === "youtube"
                      ? "📺"
                      : app.icon === "message-circle"
                      ? "💬"
                      : app.icon === "gamepad"
                      ? "🎮"
                      : app.icon === "sparkles"
                      ? "✨"
                      : app.icon || "📱";
                  return (
                    <div
                      key={app.name || (app as any).appName}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-xl shadow-2xs">
                          {displayIcon}
                        </div>
                        <div>
                          <p className="font-extrabold text-slate-900 text-sm">{app.name || (app as any).appName}</p>
                          <p className="text-xs text-slate-500">
                            {app.category === "educacion" ? "🎓 Educativo" : "🎮 Ocio / Redes"}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-black text-slate-900 text-sm">{app.minutesToday || (app as any).durationMinutes || 0} min</p>
                        <p className="text-[11px] text-slate-400">
                          {Math.round(
                            ((app.minutesToday || (app as any).durationMinutes || 0) /
                              (profile?.screenTimeMinutesToday || 164)) *
                              100
                          )}
                          % del total
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB: INSIGNIAS Y TROFEOS (Section 9) */}
      {activeTab === "badges" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-extrabold text-slate-900">
                Insignias y Logros Desbloqueados
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Cada logro demuestra tu constancia y dedicación en 6.º de primaria.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {badges.map((b) => (
                <div
                  key={b.id}
                  className={`p-5 rounded-3xl border transition-all flex items-start space-x-4 ${
                    b.unlocked
                      ? "bg-white border-amber-200 shadow-xs ring-1 ring-amber-100"
                      : "bg-slate-50 border-slate-200 opacity-60"
                  }`}
                >
                  <div className="text-4xl shrink-0">{b.icon}</div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-1.5">
                      <h3 className="font-extrabold text-sm text-slate-900">{b.title}</h3>
                      {b.unlocked ? (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded-md">
                          Conseguida
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-slate-500 bg-slate-200 px-1.5 py-0.2 rounded-md">
                          Bloqueada
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 leading-snug">{b.description}</p>
                    {b.unlockedAt && (
                      <p className="text-[10px] text-amber-600 font-semibold mt-1">
                        Desbloqueado el {b.unlockedAt}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
