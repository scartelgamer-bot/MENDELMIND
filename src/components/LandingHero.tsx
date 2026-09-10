import React from "react";
import {
  Brain,
  Sparkles,
  BookOpen,
  CheckSquare,
  Gift,
  Smartphone,
  ShieldCheck,
  Flame,
  Star,
  Swords,
  ArrowRight,
  Play,
} from "lucide-react";
import { useApp } from "../context/AppContext";

export const LandingHero: React.FC = () => {
  const { setAuthModalOpen, setAuthModalInitialMode, loginAsDemo } = useApp();

  const features = [
    {
      icon: Brain,
      color: "bg-blue-500",
      title: "Inteligencia Artificial Educativa",
      desc: "Tutor pedagógico socrático para 6.° de primaria. Explica paso a paso sin dar solo la respuesta.",
    },
    {
      icon: BookOpen,
      color: "bg-indigo-500",
      title: "Cuestionarios Automáticos",
      desc: "Evaluaciones interactivas por tema y dificultad con revisión detallada de cada acierto y error.",
    },
    {
      icon: CheckSquare,
      color: "bg-teal-500",
      title: "Organización y Plan Semanal",
      desc: "Agenda de tareas, calendario de exámenes y un plan inteligente que distribuye tu tiempo de estudio.",
    },
    {
      icon: Gift,
      color: "bg-emerald-500",
      title: "Sistema de Recompensas",
      desc: "Gana PapelPuntos y canjéalos por horas de celular, salidas familiares y juegos con aprobación de tus padres.",
    },
    {
      icon: Smartphone,
      color: "bg-amber-500",
      title: "Seguimiento de Pantalla",
      desc: "Equilibra tu tiempo digital. No busca quitarte el celular, sino enseñarte a administrarlo sabiamente.",
    },
    {
      icon: Swords,
      color: "bg-rose-500",
      title: "Gamificación & Boss Battles",
      desc: "Sube de nivel, mantén tu racha de estudio y desafía al Boss final de Matemática para ganar premios épicos.",
    },
  ];

  return (
    <div className="space-y-12 py-6 animate-fade-in max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="text-center space-y-6 pt-6 sm:pt-10">
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-bold shadow-xs">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>Plataforma Educativa para 6.º de Primaria</span>
        </div>

        <div className="space-y-3 max-w-3xl mx-auto">
          <div className="flex items-center justify-center space-x-3">
            <div className="w-14 h-14 rounded-3xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 p-0.5 shadow-xl flex items-center justify-center text-white">
              <div className="w-full h-full bg-slate-900/10 rounded-[22px] flex items-center justify-center">
                <Brain className="w-8 h-8 text-white animate-pulse" />
              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight font-heading">
              Mendel<span className="text-blue-600">Mind</span>
            </h1>
          </div>

          <p className="text-xl sm:text-2xl font-bold text-slate-700 font-heading">
            “Aprende, mejora y gana recompensas.”
          </p>

          <p className="text-sm sm:text-base text-slate-500 leading-relaxed max-w-2xl mx-auto">
            MendelMind enseña al estudiante a administrar su tiempo, aprender de forma inteligente y convertir sus responsabilidades en logros.
          </p>
        </div>

        {/* CTAs (Section 1 from spec) */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={loginAsDemo}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:opacity-95 text-white font-black text-sm shadow-xl shadow-blue-500/25 flex items-center space-x-2 transition-all transform hover:-translate-y-0.5"
          >
            <Play className="w-4 h-4 fill-white" />
            <span>Probar Demo Directa</span>
          </button>

          <button
            onClick={() => {
              setAuthModalInitialMode("register");
              setAuthModalOpen(true);
            }}
            className="px-6 py-4 rounded-2xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-extrabold text-sm shadow-xs transition-colors"
          >
            Crear Cuenta de Estudiante
          </button>

          <button
            onClick={() => {
              setAuthModalInitialMode("login");
              setAuthModalOpen(true);
            }}
            className="px-6 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-sm transition-colors"
          >
            Iniciar Sesión
          </button>
        </div>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-6">
        {features.map((feat, idx) => {
          const Icon = feat.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow space-y-3"
            >
              <div className={`w-12 h-12 rounded-2xl ${feat.color} text-white flex items-center justify-center shadow-md`}>
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-extrabold text-slate-900 text-lg">{feat.title}</h3>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                {feat.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Quote Banner */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white text-center max-w-4xl mx-auto shadow-2xl relative overflow-hidden">
        <div className="relative z-10 space-y-3">
          <p className="text-lg sm:text-xl font-medium text-slate-200 italic max-w-2xl mx-auto">
            “MendelMind no busca simplemente quitarle el celular al estudiante. Busca enseñarle a administrar mejor su tiempo, aprender de forma inteligente y convertir sus responsabilidades en logros.”
          </p>
          <div className="pt-2">
            <button
              onClick={loginAsDemo}
              className="px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-extrabold text-xs inline-flex items-center space-x-2 transition-colors"
            >
              <span>Explorar el Panel de Mateo (Demo)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
