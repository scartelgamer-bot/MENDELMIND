import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Sparkles,
  Flame,
  Trophy,
  Star,
  Timer,
  Shield,
  User,
  LogOut,
  ChevronDown,
  Lock,
  BookOpen,
  CheckSquare,
  Gift,
  TrendingUp,
  Brain,
  Swords,
} from "lucide-react";

interface HeaderProps {
  onOpenParentModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenParentModal }) => {
  const {
    profile,
    isLoggedIn,
    isParentMode,
    setIsParentMode,
    activeTab,
    setActiveTab,
    setFocusTimerOpen,
    setBossBattleOpen,
    setAuthModalOpen,
    setAuthModalInitialMode,
    logout,
  } = useApp();

  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Inicio", icon: Sparkles },
    { id: "ai-tutor", label: "MendelMind IA", icon: Brain },
    { id: "quizzes", label: "Cuestionarios", icon: BookOpen },
    { id: "tasks", label: "Tareas y Plan", icon: CheckSquare },
    { id: "rewards", label: "Recompensas", icon: Gift },
    { id: "progress", label: "Progreso", icon: TrendingUp },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab("dashboard")}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 p-0.5 shadow-md flex items-center justify-center text-white">
              <div className="w-full h-full bg-slate-900/10 backdrop-blur-xs rounded-[14px] flex items-center justify-center">
                <Brain className="w-6 h-6 text-white animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 font-heading">
                  Mendel<span className="text-blue-600">Mind</span>
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 uppercase tracking-wider">
                  6.º Primaria
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                Aprende, mejora y gana recompensas
              </p>
            </div>
          </div>

          {/* Center/Desktop Navigation */}
          {isLoggedIn && (
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id && !isParentMode;
                return (
                  <button
                    key={item.id}
                    id={`nav-${item.id}`}
                    onClick={() => {
                      setIsParentMode(false);
                      setActiveTab(item.id);
                    }}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 ${
                      isActive
                        ? "bg-blue-50 text-blue-600 shadow-xs ring-1 ring-blue-200"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Bar */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {isLoggedIn && profile ? (
              <>
                {/* Gamification Badges: Streak & Points */}
                <div className="hidden sm:flex items-center space-x-2">
                  {/* Streak */}
                  <div
                    title="Racha de días consecutivos estudiando"
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold shadow-xs cursor-default"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span>{profile.streakDays} días</span>
                    {profile.streakFrozen && (
                      <Shield className="w-3 h-3 text-blue-500 fill-blue-200" title="Protección activa" />
                    )}
                  </div>

                  {/* PapelPuntos */}
                  <div
                    title="Tus PapelPuntos para canjear por premios reales y virtuales"
                    className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-xs cursor-default"
                  >
                    <Trophy className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{profile.papelPuntos} Puntos</span>
                  </div>

                  {/* Level Pill */}
                  <div
                    title={`Nivel ${profile.level}: ${profile.levelTitle}`}
                    className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold shadow-xs cursor-default"
                  >
                    <Star className="w-3.5 h-3.5 text-indigo-600 fill-indigo-500" />
                    <span>Nivel {profile.level}</span>
                  </div>
                </div>

                {/* Quick Focus Button */}
                <button
                  id="btn-focus-mode"
                  onClick={() => setFocusTimerOpen(true)}
                  title="Modo Concentración (Temporizador de estudio con XP)"
                  className="p-2 sm:px-3 sm:py-1.5 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 border border-violet-200 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
                >
                  <Timer className="w-4 h-4 text-violet-600" />
                  <span className="hidden sm:inline">Modo Concentración</span>
                </button>

                {/* Boss Battle Button */}
                <button
                  id="btn-boss-battle"
                  onClick={() => setBossBattleOpen(true)}
                  title="Boss Final de Curso: Desafío para ganar recompensas épicas"
                  className="p-2 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white hover:opacity-90 shadow-xs flex items-center justify-center transition-all"
                >
                  <Swords className="w-4 h-4 text-white" />
                </button>

                {/* Parent Mode Toggle */}
                <button
                  id="btn-parent-mode-toggle"
                  onClick={() => {
                    if (isParentMode) {
                      setIsParentMode(false);
                      setActiveTab("dashboard");
                    } else {
                      onOpenParentModal();
                    }
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                    isParentMode
                      ? "bg-amber-600 text-white shadow-sm ring-2 ring-amber-400"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300"
                  }`}
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">{isParentMode ? "Volver a Alumno" : "Modo Padres"}</span>
                </button>

                {/* User Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors focus:outline-hidden"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
                      {profile.name.charAt(0)}
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-sm font-bold text-slate-900">{profile.name} {profile.lastName}</p>
                        <p className="text-xs text-slate-500">{profile.grade}</p>
                        <p className="text-xs text-blue-600 font-semibold mt-1">
                          {profile.levelTitle} (Nv. {profile.level})
                        </p>
                      </div>

                      <button
                        onClick={() => {
                          setActiveTab("progress");
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                      >
                        <User className="w-4 h-4 text-slate-400" />
                        <span>Mi Perfil y Avatares</span>
                      </button>

                      <button
                        onClick={() => {
                          onOpenParentModal();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                      >
                        <Lock className="w-4 h-4 text-slate-400" />
                        <span>Control Parental</span>
                      </button>

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center space-x-2"
                      >
                        <LogOut className="w-4 h-4 text-rose-500" />
                        <span>Cerrar sesión</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <button
                  id="btn-open-login"
                  onClick={() => {
                    setAuthModalInitialMode("login");
                    setAuthModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Iniciar sesión
                </button>
                <button
                  id="btn-open-register"
                  onClick={() => {
                    setAuthModalInitialMode("register");
                    setAuthModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors"
                >
                  Crear cuenta
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation bar */}
        {isLoggedIn && (
          <div className="lg:hidden flex items-center justify-between overflow-x-auto py-2.5 border-t border-slate-100 gap-1 scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id && !isParentMode;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setIsParentMode(false);
                    setActiveTab(item.id);
                  }}
                  className={`flex flex-col items-center justify-center min-w-[62px] py-1.5 px-2 rounded-xl text-[11px] font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-slate-500 hover:text-slate-900"
                  }`}
                >
                  <Icon className="w-4 h-4 mb-0.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
