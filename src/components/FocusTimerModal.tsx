import React, { useState, useEffect } from "react";
import { Timer, X, Play, Pause, RotateCcw, Sparkles, CheckCircle2 } from "lucide-react";
import { useApp } from "../context/AppContext";

export const FocusTimerModal: React.FC = () => {
  const { isFocusTimerOpen, setFocusTimerOpen, addXP, addPapelPuntos, triggerCelebration } = useApp();

  const [selectedDurationMinutes, setSelectedDurationMinutes] = useState(20);
  const [timeLeft, setTimeLeft] = useState(20 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    setTimeLeft(selectedDurationMinutes * 60);
    setIsRunning(false);
    setIsCompleted(false);
  }, [selectedDurationMinutes, isFocusTimerOpen]);

  useEffect(() => {
    let timer: any = null;
    if (isRunning && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isRunning && timeLeft === 0) {
      setIsRunning(false);
      setIsCompleted(true);
      triggerCelebration();
      addXP(40, `Modo Concentración de ${selectedDurationMinutes} min`);
      addPapelPuntos(20, `Sesión de enfoque completada`);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft]);

  if (!isFocusTimerOpen) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercent = Math.round(
    ((selectedDurationMinutes * 60 - timeLeft) / (selectedDurationMinutes * 60)) * 100
  );

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(selectedDurationMinutes * 60);
    setIsCompleted(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-6 animate-scale-up relative">
        <button
          onClick={() => setFocusTimerOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center space-y-1">
          <div className="w-12 h-12 rounded-2xl bg-violet-100 text-violet-700 flex items-center justify-center mx-auto shadow-xs">
            <Timer className="w-6 h-6 animate-pulse" />
          </div>
          <h3 className="text-xl font-black text-slate-900 font-heading">
            Modo Concentración
          </h3>
          <p className="text-xs text-slate-500">
            Estudia sin distracciones. ¡Cada sesión te otorga +40 XP y +20 PapelPuntos!
          </p>
        </div>

        {/* Duration selector */}
        {!isRunning && !isCompleted && (
          <div className="flex items-center justify-center space-x-2">
            {[15, 20, 25].map((mins) => (
              <button
                key={mins}
                onClick={() => setSelectedDurationMinutes(mins)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedDurationMinutes === mins
                    ? "bg-violet-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {mins} minutos
              </button>
            ))}
          </div>
        )}

        {/* Countdown Display */}
        <div className="text-center py-6 bg-slate-50 rounded-3xl border border-slate-100">
          <div className="text-5xl sm:text-6xl font-black text-slate-900 tracking-tight font-mono">
            {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
          </div>

          <div className="w-48 mx-auto bg-slate-200 rounded-full h-2 mt-4 overflow-hidden">
            <div
              className="bg-violet-600 h-2 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-xs text-slate-500 mt-3 font-semibold">
            {isCompleted
              ? "¡Objetivo logrado! 5 minutos de descanso recomendados 🥤"
              : isRunning
              ? "Respira profundo y concéntrate en tu tema 📖"
              : "Listo para iniciar tu sesión de enfoque"}
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center space-x-3">
          {isCompleted ? (
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-2xl bg-violet-600 hover:bg-violet-700 text-white font-bold text-xs shadow-md transition-colors flex items-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Iniciar otra sesión</span>
            </button>
          ) : (
            <>
              <button
                onClick={handleReset}
                className="p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors"
                title="Reiniciar"
              >
                <RotateCcw className="w-5 h-5" />
              </button>

              <button
                onClick={() => setIsRunning(!isRunning)}
                className={`px-8 py-3 rounded-2xl font-extrabold text-sm shadow-md transition-all flex items-center space-x-2 ${
                  isRunning
                    ? "bg-amber-500 hover:bg-amber-600 text-white"
                    : "bg-violet-600 hover:bg-violet-700 text-white"
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-5 h-5" />
                    <span>Pausar</span>
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5 fill-white" />
                    <span>Comenzar</span>
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
