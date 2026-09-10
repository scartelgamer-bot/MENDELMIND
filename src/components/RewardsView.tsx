import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Trophy,
  Gift,
  Lock,
  CheckCircle2,
  Clock,
  Sparkles,
  Smartphone,
  Utensils,
  Film,
  Gamepad2,
  Bike,
  Palette,
  ShieldCheck,
  UserCheck,
  AlertCircle,
} from "lucide-react";

export const RewardsView: React.FC = () => {
  const {
    profile,
    rewards,
    requestReward,
    claimReward,
    updateProfileAvatar,
  } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<"all" | "real_parental" | "digital">("all");

  const avatarOptions = [
    { id: "cosmo-owl", name: "Búho Sabio Cósmico", icon: "🦉", cost: 0, unlocked: true },
    { id: "astro-cat", name: "Gatito Astronauta", icon: "🐱‍🚀", cost: 150, unlocked: true },
    { id: "robot-mind", name: "Robo-Genio 3000", icon: "🤖", cost: 200, unlocked: false },
    { id: "super-dragon", name: "Dragón del Saber", icon: "🐲", cost: 350, unlocked: false },
    { id: "cyber-fox", name: "Zorro Matemático", icon: "🦊", cost: 250, unlocked: false },
    { id: "galaxy-bear", name: "Oso Científico", icon: "🐻", cost: 300, unlocked: false },
  ];

  const getRewardIcon = (iconName: string) => {
    switch (iconName) {
      case "smartphone":
        return <Smartphone className="w-6 h-6 text-blue-500" />;
      case "utensils":
        return <Utensils className="w-6 h-6 text-amber-500" />;
      case "film":
        return <Film className="w-6 h-6 text-purple-500" />;
      case "gamepad-2":
        return <Gamepad2 className="w-6 h-6 text-rose-500" />;
      case "bike":
        return <Bike className="w-6 h-6 text-emerald-500" />;
      case "palette":
        return <Palette className="w-6 h-6 text-indigo-500" />;
      default:
        return <Sparkles className="w-6 h-6 text-amber-500" />;
    }
  };

  const filteredRewards = rewards.filter((r) => {
    if (categoryFilter === "all") return true;
    return r.category === categoryFilter;
  });

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white">
            <Trophy className="w-3.5 h-3.5 text-amber-300" />
            <span>Sistema de Recompensas y Hábitos</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-heading">
            Tus PapelPuntos y Premios Familiares
          </h1>
          <p className="text-emerald-100 text-xs sm:text-sm leading-relaxed">
            Canjea tus puntos por recompensas reales acordadas con tus padres o desbloquea avatares especiales.
          </p>
        </div>

        {/* Current Balance Card */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-3xl shrink-0 text-center">
          <p className="text-xs text-emerald-100 font-bold uppercase tracking-wider">Tu saldo actual</p>
          <p className="text-3xl sm:text-4xl font-black text-white mt-0.5">
            {profile?.papelPuntos} <span className="text-lg font-bold">pts</span>
          </p>
          <div className="mt-2 text-[11px] text-emerald-200 font-medium">
            🔥 Mantén tu racha para ganar más
          </div>
        </div>
      </div>

      {/* Parental Approval Notice banner */}
      <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start space-x-3">
        <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <strong className="font-bold">Regla de oro de MendelMind:</strong> Las recompensas reales (+1h de celular, tiempo de videojuegos, comidas favoritas) requieren la <strong>aprobación directa de tus padres o tutores</strong> desde su panel de Control Parental. No se activan automáticamente.
        </div>
      </div>

      {/* Category filter tabs */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => setCategoryFilter("all")}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            categoryFilter === "all"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Todas las Recompensas ({rewards.length})
        </button>
        <button
          onClick={() => setCategoryFilter("real_parental")}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            categoryFilter === "real_parental"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Premios con Aprobación Parental
        </button>
        <button
          onClick={() => setCategoryFilter("digital")}
          className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all ${
            categoryFilter === "digital"
              ? "bg-emerald-600 text-white shadow-xs"
              : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
          }`}
        >
          Avatares y Fondos Digitales
        </button>
      </div>

      {/* Rewards Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredRewards.map((reward) => {
          const canAfford = (profile?.papelPuntos || 0) >= reward.costPuntos;
          const isPending = reward.status === "solicitada";
          const isApproved = reward.status === "aprobada";
          const isClaimed = reward.status === "canjeada";

          return (
            <div
              key={reward.id}
              className={`p-5 rounded-3xl border transition-all flex flex-col justify-between ${
                isApproved
                  ? "bg-emerald-50/50 border-emerald-300 ring-2 ring-emerald-400"
                  : isPending
                  ? "bg-amber-50/40 border-amber-300"
                  : isClaimed
                  ? "bg-slate-50 border-slate-200 opacity-60"
                  : "bg-white border-slate-200/90 shadow-xs hover:shadow-md"
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center shrink-0">
                    {getRewardIcon(reward.icon)}
                  </div>
                  <span className="text-xs font-black px-3 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    {reward.costPuntos} pts
                  </span>
                </div>

                <h3 className="font-extrabold text-base text-slate-900">{reward.title}</h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {reward.description}
                </p>

                {/* Status Badges */}
                <div className="mt-3">
                  {isPending && (
                    <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-100 text-amber-800 text-[11px] font-bold">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Esperando aprobación de tus padres</span>
                    </div>
                  )}
                  {isApproved && (
                    <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>¡Aprobado por {profile?.parentName}!</span>
                    </div>
                  )}
                  {isClaimed && (
                    <div className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-200 text-slate-700 text-[11px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Canjeado y disfrutado</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-3 border-t border-slate-100">
                {isApproved ? (
                  <button
                    onClick={() => claimReward(reward.id)}
                    className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-sm transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Marcar como Disfrutado</span>
                  </button>
                ) : isPending ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl bg-amber-200 text-amber-800 font-bold text-xs cursor-not-allowed"
                  >
                    Revisión pendiente
                  </button>
                ) : isClaimed ? (
                  <button
                    disabled
                    className="w-full py-2.5 rounded-xl bg-slate-100 text-slate-400 font-bold text-xs cursor-not-allowed"
                  >
                    Premio canjeado
                  </button>
                ) : (
                  <button
                    onClick={() => requestReward(reward.id)}
                    disabled={!canAfford}
                    className={`w-full py-2.5 rounded-xl font-bold text-xs shadow-xs transition-colors flex items-center justify-center space-x-1.5 ${
                      canAfford
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed"
                    }`}
                  >
                    <Gift className="w-4 h-4" />
                    <span>
                      {reward.category === "real_parental"
                        ? "Pedir canje a papá/mamá"
                        : "Desbloquear Recompensa"}
                    </span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Avatar Customization Section (Section 25) */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">
              Personalización de Avatares (Desbloqueados por Progreso)
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              ¡Sin pagos reales! Se desbloquean exclusivamente estudiando y subiendo de nivel.
            </p>
          </div>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Actual: {profile?.avatarName}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
          {avatarOptions.map((av) => {
            const isSelected = profile?.avatarId === av.id;
            return (
              <div
                key={av.id}
                onClick={() => {
                  if (av.unlocked) {
                    updateProfileAvatar(av.id, av.name);
                  }
                }}
                className={`p-4 rounded-2xl border text-center transition-all cursor-pointer ${
                  isSelected
                    ? "border-blue-600 bg-blue-50 ring-2 ring-blue-500 shadow-xs"
                    : av.unlocked
                    ? "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                    : "border-slate-100 bg-slate-50 opacity-60"
                }`}
              >
                <div className="text-4xl mb-2">{av.icon}</div>
                <p className="font-bold text-xs text-slate-800 line-clamp-1">{av.name}</p>
                <div className="mt-1">
                  {isSelected ? (
                    <span className="text-[10px] font-extrabold text-blue-600">Activo</span>
                  ) : av.unlocked ? (
                    <span className="text-[10px] font-bold text-emerald-600">Disponible</span>
                  ) : (
                    <span className="text-[10px] font-bold text-slate-400">Nivel 9 Requerido</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
