import React, { useState } from "react";
import { Brain, X, Sparkles, CheckCircle2, User, Mail, Lock, School } from "lucide-react";
import { useApp } from "../context/AppContext";

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setAuthModalOpen,
    authModalInitialMode,
    loginAsDemo,
    login,
  } = useApp();

  const [mode, setMode] = useState<"login" | "register">("login");

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Registration form state (Section 2 from spec)
  const [regName, setRegName] = useState("");
  const [regLastName, setRegLastName] = useState("");
  const [regAge, setRegAge] = useState(11);
  const [regGrade, setRegGrade] = useState("6.° de Primaria");
  const [regSchool, setRegSchool] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regParentName, setRegParentName] = useState("");
  const [regParentEmail, setRegParentEmail] = useState("");

  // Sync mode with prop
  React.useEffect(() => {
    if (authModalInitialMode) {
      setMode(authModalInitialMode);
    }
  }, [authModalInitialMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(loginEmail, loginPassword);
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Register with mock profile
    login(regEmail, regPassword);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5 animate-scale-up relative my-8">
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 p-0.5 shadow-md flex items-center justify-center mx-auto text-white">
            <div className="w-full h-full bg-slate-900/10 rounded-[14px] flex items-center justify-center">
              <Brain className="w-7 h-7 text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-900 font-heading">
            Mendel<span className="text-blue-600">Mind</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">
            Aprende, mejora y gana recompensas.
          </p>
        </div>

        {/* Quick Demo Button (Section 3 from spec) */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold text-blue-900">¿Quieres probarlo al instante?</p>
            <p className="text-[11px] text-blue-700">
              Explora con Mateo (850 pts, racha de 7 días y tareas).
            </p>
          </div>
          <button
            onClick={loginAsDemo}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-sm transition-colors shrink-0"
          >
            Probar Demo
          </button>
        </div>

        {/* Switcher */}
        <div className="flex rounded-2xl bg-slate-100 p-1">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === "login"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === "register"
                ? "bg-white text-slate-900 shadow-xs"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Crear Cuenta (6.° Primaria)
          </button>
        </div>

        {/* 1. LOGIN FORM */}
        {mode === "login" ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="mateo.estudiante@ejemplo.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-colors"
            >
              Entrar a MendelMind
            </button>
          </form>
        ) : (
          /* 2. REGISTRATION FORM (Section 2 from spec) */
          <form onSubmit={handleRegisterSubmit} className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Nombre</label>
                <input
                  type="text"
                  required
                  placeholder="Mateo"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Apellidos</label>
                <input
                  type="text"
                  required
                  placeholder="Gómez"
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Edad</label>
                <input
                  type="number"
                  min="9"
                  max="15"
                  value={regAge}
                  onChange={(e) => setRegAge(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Grado</label>
                <input
                  type="text"
                  value={regGrade}
                  onChange={(e) => setRegGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden bg-slate-50"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-600 block mb-1">Colegio</label>
              <input
                type="text"
                placeholder="Colegio San Agustín"
                value={regSchool}
                onChange={(e) => setRegSchool(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Correo Estudiante</label>
                <input
                  type="email"
                  required
                  placeholder="alumno@colegio.edu"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Contraseña</label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100">
              <p className="text-[11px] font-extrabold uppercase text-amber-700 tracking-wider mb-2">
                Datos del Padre, Madre o Tutor
              </p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Nombre del Tutor</label>
                  <input
                    type="text"
                    required
                    placeholder="Carlos Gómez"
                    value={regParentName}
                    onChange={(e) => setRegParentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Correo del Tutor</label>
                  <input
                    type="email"
                    required
                    placeholder="carlos.tutor@correo.com"
                    value={regParentEmail}
                    onChange={(e) => setRegParentEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-md transition-colors mt-2"
            >
              Completar Registro
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
