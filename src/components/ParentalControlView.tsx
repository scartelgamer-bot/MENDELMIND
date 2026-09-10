import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  ShieldCheck,
  Lock,
  Clock,
  CheckCircle2,
  XCircle,
  Plus,
  Sliders,
  AlertTriangle,
  Gift,
  BookOpen,
  Eye,
  LogOut,
  Smartphone,
  Calendar,
  Save,
} from "lucide-react";

export const ParentalControlView: React.FC = () => {
  const {
    profile,
    rewards,
    tasks,
    mastery,
    approveReward,
    rejectReward,
    createCustomReward,
    updateScreenTimeLimit,
    setIsParentMode,
    setActiveTab,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<"overview" | "approvals" | "limits" | "new-reward">("overview");

  // Screen time limit slider state
  const [newLimitHours, setNewLimitHours] = useState(
    Math.floor((profile?.screenTimeLimitMinutes || 180) / 60)
  );

  // New custom reward state
  const [newRewardTitle, setNewRewardTitle] = useState("");
  const [newRewardDesc, setNewRewardDesc] = useState("");
  const [newRewardPoints, setNewRewardPoints] = useState(150);
  const [createdNotice, setCreatedNotice] = useState(false);

  const pendingApprovals = rewards.filter((r) => r.status === "solicitada");

  const handleSaveScreenLimit = () => {
    updateScreenTimeLimit(newLimitHours * 60);
    alert(`Límite diario actualizado a ${newLimitHours} horas.`);
  };

  const handleCreateReward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRewardTitle.trim()) return;

    createCustomReward({
      title: newRewardTitle.trim(),
      description: newRewardDesc.trim() || "Recompensa acordada en familia.",
      costPuntos: Number(newRewardPoints) || 100,
      icon: "gift",
      category: "real_parental",
      requiresParentApproval: true,
      status: "disponible",
    });

    setNewRewardTitle("");
    setNewRewardDesc("");
    setCreatedNotice(true);
    setTimeout(() => setCreatedNotice(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Parental Header */}
      <div className="bg-gradient-to-r from-amber-700 via-orange-700 to-amber-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-amber-100">
            <Lock className="w-3.5 h-3.5 text-amber-300" />
            <span>Panel Exclusivo de Control Parental</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading">
            Tutor: {profile?.parentName}
          </h1>
          <p className="text-amber-100 text-xs sm:text-sm max-w-xl">
            Supervisión pedagógica y gestión de recompensas familiares para el estudiante {profile?.name} {profile?.lastName} (6.º de Primaria).
          </p>
        </div>

        <button
          onClick={() => {
            setIsParentMode(false);
            setActiveTab("dashboard");
          }}
          className="px-5 py-2.5 rounded-2xl bg-white text-amber-900 hover:bg-amber-50 font-extrabold text-xs sm:text-sm shadow-md flex items-center space-x-2 transition-all shrink-0 self-start md:self-auto"
        >
          <LogOut className="w-4 h-4 text-amber-800" />
          <span>Volver al Modo Estudiante</span>
        </button>
      </div>

      {/* Parental sub-navigation */}
      <div className="flex items-center space-x-1 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs overflow-x-auto scrollbar-none">
        <button
          onClick={() => setActiveSubTab("overview")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === "overview"
              ? "bg-amber-700 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Resumen Académico & Hábitos
        </button>
        <button
          onClick={() => setActiveSubTab("approvals")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
            activeSubTab === "approvals"
              ? "bg-amber-700 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <span>Solicitudes de Recompensas</span>
          {pendingApprovals.length > 0 && (
            <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-black">
              {pendingApprovals.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveSubTab("limits")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
            activeSubTab === "limits"
              ? "bg-amber-700 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          Límites de Pantalla & Horarios
        </button>
        <button
          onClick={() => setActiveSubTab("new-reward")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center space-x-1 ${
            activeSubTab === "new-reward"
              ? "bg-amber-700 text-white shadow-xs"
              : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Crear Recompensa del Hogar</span>
        </button>
      </div>

      {/* 1. OVERVIEW */}
      {activeSubTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Screen Time Status */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 mb-2">
                <Smartphone className="w-4 h-4 text-amber-600" />
                <span>Tiempo de Pantalla Hoy</span>
              </div>
              <p className="text-2xl font-black text-slate-900">
                {Math.floor((profile?.screenTimeMinutesToday || 0) / 60)}h {(profile?.screenTimeMinutesToday || 0) % 60}m
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Límite configurado: {Math.floor((profile?.screenTimeLimitMinutes || 180) / 60)} horas
              </p>
              <span className="inline-block mt-3 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                Disminuyó 15% esta semana
              </span>
            </div>

            {/* Academic Snapshot */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 mb-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Rendimiento Curricular</span>
              </div>
              <p className="text-2xl font-black text-blue-600">82 % Global</p>
              <p className="text-xs text-slate-500 mt-1">
                Fortaleza: Comunicación (88%)
              </p>
              <p className="text-xs text-amber-700 font-bold mt-1">
                Atención sugerida: Fracciones en Matemática
              </p>
            </div>

            {/* Pending Homework */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs">
              <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 mb-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                <span>Estado de Deberes</span>
              </div>
              <p className="text-2xl font-black text-slate-900">
                {tasks.filter((t) => t.status === "Completada").length} / {tasks.length}
              </p>
              <p className="text-xs text-slate-500 mt-1">tareas completadas a tiempo</p>
              <span className="inline-block mt-3 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-md">
                Racha activa de {profile?.streakDays} días
              </span>
            </div>
          </div>

          {/* Parental Insight on Subject Mastery */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <h2 className="font-extrabold text-slate-900 text-lg">
              Evaluación Diagnóstica para Padres
            </h2>
            <p className="text-xs text-slate-500">
              MendelMind IA detecta automáticamente dónde necesita apoyo tu hijo para que puedas conversar con sus profesores o acompañarlo en casa:
            </p>

            <div className="space-y-3">
              {mastery.map((item) => (
                <div key={item.course} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 text-sm">{item.course}</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {item.topics.map((t) => (
                        <span
                          key={t.topic}
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${
                            t.level === "dominado"
                              ? "bg-emerald-100 text-emerald-800"
                              : t.level === "en_proceso"
                              ? "bg-amber-100 text-amber-800"
                              : "bg-rose-100 text-rose-800 font-bold"
                          }`}
                        >
                          {t.topic} ({t.level === "dominado" ? "Dominado" : t.level === "en_proceso" ? "En proceso" : "Reforzar"})
                        </span>
                      ))}
                    </div>
                  </div>

                  <span className="font-black text-sm text-slate-800 shrink-0 ml-4">
                    {item.overallPercentage}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. APPROVALS */}
      {activeSubTab === "approvals" && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
            <div>
              <h2 className="font-extrabold text-slate-900 text-lg">
                Solicitudes de Recompensas Familiares
              </h2>
              <p className="text-xs text-slate-500">
                Tu hijo ha canjeado sus PapelPuntos por estos premios. Tú decides si autorizarlos según su conducta y deberes escolares.
              </p>
            </div>

            {pendingApprovals.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                <p className="font-bold text-slate-800 text-sm">No hay solicitudes pendientes</p>
                <p className="text-xs text-slate-500 mt-1">
                  Cuando tu hijo solicite un canje desde su panel, aparecerá aquí para tu aprobación.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingApprovals.map((reward) => (
                  <div
                    key={reward.id}
                    className="p-5 rounded-2xl bg-amber-50/50 border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-amber-200 text-amber-900">
                          {reward.costPuntos} pts canjeados
                        </span>
                        <span className="text-xs text-slate-500">
                          Solicitado por {profile?.name}
                        </span>
                      </div>
                      <h3 className="font-extrabold text-slate-900 text-base">{reward.title}</h3>
                      <p className="text-xs text-slate-600 mt-0.5">{reward.description}</p>
                    </div>

                    <div className="flex items-center space-x-2 shrink-0">
                      <button
                        onClick={() => rejectReward(reward.id)}
                        className="px-4 py-2 rounded-xl border border-slate-300 hover:bg-white text-slate-700 text-xs font-bold flex items-center space-x-1.5 transition-colors"
                      >
                        <XCircle className="w-4 h-4 text-rose-500" />
                        <span>Rechazar</span>
                      </button>

                      <button
                        onClick={() => approveReward(reward.id)}
                        className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Aprobar Recompensa</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 3. SCREEN TIME LIMITS */}
      {activeSubTab === "limits" && (
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
            <div>
              <h2 className="font-extrabold text-slate-900 text-lg">
                Configurar Límite Diario de Celular y Dispositivos
              </h2>
              <p className="text-xs text-slate-500">
                Ayuda a tu hijo a cumplir su meta familiar para que gane bonos de PapelPuntos por autocontrol.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 max-w-lg">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">Límite Diario Permitido:</span>
                <span className="text-2xl font-black text-amber-800">{newLimitHours} Horas</span>
              </div>

              <input
                type="range"
                min="1"
                max="6"
                step="0.5"
                value={newLimitHours}
                onChange={(e) => setNewLimitHours(Number(e.target.value))}
                className="w-full accent-amber-600 cursor-pointer"
              />

              <div className="flex justify-between text-xs text-slate-400 font-semibold">
                <span>1 hora</span>
                <span>3 horas (Recomendado 6.º Primaria)</span>
                <span>6 horas</span>
              </div>

              <button
                onClick={handleSaveScreenLimit}
                className="mt-3 px-5 py-2.5 rounded-xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs flex items-center space-x-2 transition-colors shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Guardar Nuevo Límite</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. NEW CUSTOM REWARD */}
      {activeSubTab === "new-reward" && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          <div>
            <h2 className="font-extrabold text-slate-900 text-lg">
              Crear Recompensa Personalizada del Hogar
            </h2>
            <p className="text-xs text-slate-500">
              Define experiencias o privilegios reales que motiven a tu hijo a estudiar con constancia.
            </p>
          </div>

          {createdNotice && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>¡Recompensa creada exitosamente en el catálogo familiar!</span>
            </div>
          )}

          <form onSubmit={handleCreateReward} className="space-y-4 max-w-lg">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Nombre de la recompensa familiar
              </label>
              <input
                type="text"
                required
                placeholder="Ej: Elegir el menú del domingo, Salida al parque de diversiones"
                value={newRewardTitle}
                onChange={(e) => setNewRewardTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Descripción / Condiciones acordadas
              </label>
              <textarea
                rows={2}
                placeholder="Ej: Válido durante el fin de semana habiendo cumplido las tareas."
                value={newRewardDesc}
                onChange={(e) => setNewRewardDesc(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Costo en PapelPuntos requeridos
              </label>
              <input
                type="number"
                min="20"
                max="2000"
                step="10"
                value={newRewardPoints}
                onChange={(e) => setNewRewardPoints(Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 rounded-2xl bg-amber-800 hover:bg-amber-900 text-white font-bold text-xs shadow-md transition-colors flex items-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar al Catálogo del Estudiante</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
