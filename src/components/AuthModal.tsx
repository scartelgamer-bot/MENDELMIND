import React, { useState } from "react";
import {
  Brain,
  X,
  Sparkles,
  User,
  Mail,
  Lock,
  School,
  Eye,
  EyeOff,
  CheckCircle2,
  Gift,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setAuthModalOpen,
    authModalInitialMode,
    loginAsDemo,
    login,
    register,
    registeredUsers,
  } = useApp();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Login form state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  // Registration form state
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
    setLoginError(null);
  }, [authModalInitialMode, isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!loginEmail.trim()) {
      setLoginError("Por favor ingresa tu correo electrónico.");
      return;
    }

    const success = login(loginEmail, loginPassword);
    if (!success) {
      setLoginError(
        "No encontramos esa cuenta o los datos son incorrectos. Puedes probar la cuenta Demo de Mateo o crear una cuenta nueva."
      );
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!regName.trim()) {
      alert("Por favor ingresa el nombre del estudiante.");
      return;
    }
    if (!regEmail.trim()) {
      alert("Por favor ingresa el correo del estudiante.");
      return;
    }

    register(
      {
        name: regName.trim(),
        lastName: regLastName.trim(),
        age: Number(regAge),
        grade: regGrade,
        email: regEmail.trim(),
        parentName: regParentName.trim() || "Tutor",
        parentEmail: regParentEmail.trim() || "tutor@familia.com",
      },
      regPassword || "123456"
    );
  };

  const fillDemoCredentials = () => {
    setLoginEmail("demo@mendelmind.com");
    setLoginPassword("123456");
    setLoginError(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-slate-200 shadow-2xl space-y-5 animate-scale-up relative my-8">
        <button
          onClick={() => setAuthModalOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          title="Cerrar"
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
            Plataforma pedagógica para 6.º de Primaria
          </p>
        </div>

        {/* Quick Demo Access banner */}
        <div className="p-3.5 rounded-2xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-blue-900 flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span>¿Quieres probar la app de inmediato?</span>
            </p>
            <p className="text-[11px] text-blue-700">
              Explora con la cuenta de Mateo (850 pts, racha de 7 días).
            </p>
          </div>
          <button
            onClick={loginAsDemo}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs shadow-xs transition-colors shrink-0 flex items-center space-x-1"
          >
            <span>Entrar Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex rounded-2xl bg-slate-100 p-1 border border-slate-200/60">
          <button
            onClick={() => {
              setMode("login");
              setLoginError(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mode === "login"
                ? "bg-white text-slate-900 shadow-xs ring-1 ring-slate-200"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            onClick={() => {
              setMode("register");
              setLoginError(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all ${
              mode === "register"
                ? "bg-white text-slate-900 shadow-xs ring-1 ring-slate-200"
                : "text-slate-500 hover:text-slate-900"
            }`}
          >
            Crear Cuenta de Estudiante
          </button>
        </div>

        {/* 1. LOGIN FORM */}
        {mode === "login" ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <p>{loginError}</p>
                  <div className="flex space-x-2 pt-1">
                    <button
                      type="button"
                      onClick={fillDemoCredentials}
                      className="text-[11px] font-bold text-blue-600 hover:underline"
                    >
                      Autollenar cuenta Demo
                    </button>
                    <span>•</span>
                    <button
                      type="button"
                      onClick={() => setMode("register")}
                      className="text-[11px] font-bold text-blue-600 hover:underline"
                    >
                      Crear cuenta
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Correo Electrónico
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  placeholder="demo@mendelmind.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">Contraseña</label>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-[11px] text-blue-600 hover:underline font-semibold"
                >
                  Usar credenciales demo
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Quick account selection pills if accounts exist */}
            {registeredUsers && registeredUsers.length > 0 && (
              <div className="pt-1">
                <p className="text-[11px] font-bold text-slate-500 mb-1.5">
                  Cuentas guardadas en este dispositivo:
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {registeredUsers.slice(0, 3).map((u) => (
                    <button
                      key={u.email}
                      type="button"
                      onClick={() => {
                        setLoginEmail(u.email);
                        setLoginPassword(u.password || "123456");
                      }}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 text-slate-700 text-[11px] font-semibold border border-slate-200 transition-colors flex items-center space-x-1"
                    >
                      <User className="w-3 h-3 text-slate-400" />
                      <span>{u.profile.name} ({u.email.split("@")[0]})</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md transition-colors flex items-center justify-center space-x-2"
            >
              <span>Iniciar Sesión en MendelMind</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* 2. REGISTRATION FORM */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
            {/* Welcome perk chip */}
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-semibold flex items-center space-x-2">
              <Gift className="w-4 h-4 text-amber-600 shrink-0" />
              <span>¡Bono de bienvenida: 150 PapelPuntos y avatar de Búho Sabio al registrarte!</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nombre del Alumno</label>
                <input
                  type="text"
                  required
                  placeholder="Mateo, Sofía, etc."
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Apellidos</label>
                <input
                  type="text"
                  required
                  placeholder="Gómez, Rodríguez..."
                  value={regLastName}
                  onChange={(e) => setRegLastName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Edad</label>
                <input
                  type="number"
                  min="9"
                  max="15"
                  value={regAge}
                  onChange={(e) => setRegAge(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Grado Escolar</label>
                <select
                  value={regGrade}
                  onChange={(e) => setRegGrade(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium bg-white"
                >
                  <option value="5.° de Primaria">5.° de Primaria</option>
                  <option value="6.° de Primaria">6.° de Primaria</option>
                  <option value="1.° de Secundaria">1.° de Secundaria</option>
                  <option value="2.° de Secundaria">2.° de Secundaria</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Colegio / Institución</label>
              <div className="relative">
                <School className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Ej: Colegio San Agustín, I.E. Mendel"
                  value={regSchool}
                  onChange={(e) => setRegSchool(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Correo del Estudiante</label>
                <input
                  type="email"
                  required
                  placeholder="alumno@colegio.edu"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Contraseña</label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/80">
              <div className="flex items-center space-x-1.5 mb-2">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                <p className="text-[11px] font-extrabold uppercase text-blue-900 tracking-wider">
                  Datos del Padre, Madre o Tutor
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Nombre del Tutor</label>
                  <input
                    type="text"
                    required
                    placeholder="Carlos Gómez"
                    value={regParentName}
                    onChange={(e) => setRegParentName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Correo del Tutor</label>
                  <input
                    type="email"
                    required
                    placeholder="tutor@familia.com"
                    value={regParentEmail}
                    onChange={(e) => setRegParentEmail(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs shadow-md transition-colors mt-2 flex items-center justify-center space-x-2"
            >
              <span>Completar Registro y Comenzar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
