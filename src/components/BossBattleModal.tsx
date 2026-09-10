import React, { useState } from "react";
import { Swords, X, Shield, Heart, Trophy, Sparkles, AlertCircle, RotateCcw } from "lucide-react";
import { useApp } from "../context/AppContext";

interface BattleQuestion {
  question: string;
  options: string[];
  correct: string;
  hint: string;
}

export const BossBattleModal: React.FC = () => {
  const { isBossBattleOpen, setBossBattleOpen, addXP, addPapelPuntos, triggerCelebration } = useApp();

  const battleQuestions: BattleQuestion[] = [
    {
      question: "Fase 1: ¿Cuánto es 3/4 + 1/2 en su forma más simple?",
      options: ["4/6", "5/4", "1 entero y 1/4", "4/4"],
      correct: "1 entero y 1/4",
      hint: "Convierte 1/2 a 2/4. Luego 3/4 + 2/4 = 5/4, que equivale a 1 entero y 1/4.",
    },
    {
      question: "Fase 2: Si compras una mochila de S/. 80 con 25% de descuento, ¿cuánto pagas?",
      options: ["S/. 60", "S/. 55", "S/. 70", "S/. 20"],
      correct: "S/. 60",
      hint: "El 25% de 80 es 20 (la cuarta parte). 80 - 20 = 60 soles.",
    },
    {
      question: "Fase 3: Un triángulo tiene base 8 cm y altura 5 cm. ¿Cuál es su área?",
      options: ["40 cm²", "20 cm²", "13 cm²", "26 cm²"],
      correct: "20 cm²",
      hint: "El área del triángulo es (base × altura) / 2. (8 × 5) / 2 = 20.",
    },
    {
      question: "Fase 4: Resuelve la ecuación: 2x + 6 = 18. ¿Cuánto vale x?",
      options: ["x = 6", "x = 12", "x = 4", "x = 8"],
      correct: "x = 6",
      hint: "Resta 6 a 18 (da 12) y luego divide entre 2: 12 / 2 = 6.",
    },
    {
      question: "Golpe Crítico Final: ¿Cuál es el promedio de las notas 14, 16 y 18?",
      options: ["15", "16", "17", "16.5"],
      correct: "16",
      hint: "Suma todas: 14 + 16 + 18 = 48. Divide entre 3: 48 / 3 = 16.",
    },
  ];

  const [currentIdx, setCurrentIdx] = useState(0);
  const [bossHp, setBossHp] = useState(100);
  const [studentHp, setStudentHp] = useState(100);
  const [battleState, setBattleState] = useState<"fighting" | "won" | "lost">("fighting");
  const [feedback, setFeedback] = useState<string | null>(null);

  if (!isBossBattleOpen) return null;

  const currentQ = battleQuestions[currentIdx];

  const handleAnswer = (option: string) => {
    if (battleState !== "fighting") return;

    if (option === currentQ.correct) {
      // Hit the boss!
      const newBossHp = Math.max(0, bossHp - 20);
      setBossHp(newBossHp);
      setFeedback("¡Ataque certero! Has restado 20 HP al Boss de Matemática. 💥");

      if (newBossHp === 0) {
        setBattleState("won");
        triggerCelebration();
        addXP(250, "👑 Victoria contra el Boss de Matemática");
        addPapelPuntos(100, "👑 Recompensa Legendaria del Boss");
      } else {
        setTimeout(() => {
          setFeedback(null);
          setCurrentIdx((prev) => prev + 1);
        }, 1200);
      }
    } else {
      // Boss counters
      const newStudentHp = Math.max(0, studentHp - 25);
      setStudentHp(newStudentHp);
      setFeedback(`¡Cuidado! ${currentQ.hint}`);

      if (newStudentHp === 0) {
        setBattleState("lost");
      }
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setBossHp(100);
    setStudentHp(100);
    setBattleState("fighting");
    setFeedback(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-xl w-full text-white shadow-2xl relative animate-scale-up space-y-6">
        <button
          onClick={() => setBossBattleOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Battle Arena Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold">
            <Swords className="w-4 h-4" />
            <span>Boss Final de 6.º de Primaria</span>
          </div>
          <h2 className="text-2xl font-black font-heading text-white">
            Guardián de las Matemáticas
          </h2>
        </div>

        {/* Health Bars: Boss vs Student */}
        <div className="grid grid-cols-2 gap-4 bg-slate-800/80 p-4 rounded-2xl border border-slate-700">
          {/* Boss */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-extrabold text-rose-400">Boss: Numeron</span>
              <span className="font-mono font-bold text-rose-300">{bossHp} / 100 HP</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-rose-500 to-amber-500 h-3 rounded-full transition-all duration-300"
                style={{ width: `${bossHp}%` }}
              />
            </div>
          </div>

          {/* Student */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-extrabold text-emerald-400">Tú (Estudiante)</span>
              <span className="font-mono font-bold text-emerald-300">{studentHp} / 100 HP</span>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-emerald-500 to-teal-400 h-3 rounded-full transition-all duration-300"
                style={{ width: `${studentHp}%` }}
              />
            </div>
          </div>
        </div>

        {/* Battle State Views */}
        {battleState === "fighting" && (
          <div className="space-y-4">
            <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                Pregunta {currentIdx + 1} de {battleQuestions.length}
              </span>
              <p className="text-base font-bold text-slate-100">{currentQ.question}</p>
            </div>

            {feedback && (
              <div className="p-3 rounded-xl bg-indigo-950/80 border border-indigo-500/40 text-xs text-indigo-200 animate-fade-in">
                💡 {feedback}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {currentQ.options.map((opt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(opt)}
                  className="p-3.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-500 text-left text-xs sm:text-sm font-semibold transition-all"
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Victory Screen */}
        {battleState === "won" && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/20 border border-amber-500 flex items-center justify-center mx-auto text-amber-400 shadow-lg">
              <Trophy className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white font-heading">
              ¡Victoria Legendaria! 👑
            </h3>
            <p className="text-sm text-slate-300 max-w-sm mx-auto">
              Has demostrado tu maestría en fracciones, decimales, geometría y ecuaciones de 6.º de primaria.
            </p>

            <div className="flex items-center justify-center space-x-3 text-sm font-extrabold">
              <span className="px-3 py-1.5 rounded-xl bg-indigo-500/20 border border-indigo-500 text-indigo-300">
                +250 XP
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500 text-emerald-300">
                +100 PapelPuntos
              </span>
            </div>

            <button
              onClick={() => setBossBattleOpen(false)}
              className="mt-4 px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-slate-950 font-black text-xs uppercase tracking-wider"
            >
              Reclamar y Volver
            </button>
          </div>
        )}

        {/* Defeat Screen */}
        {battleState === "lost" && (
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-rose-500/20 border border-rose-500 flex items-center justify-center mx-auto text-rose-400 shadow-lg">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white font-heading">
              ¡Buen Intento! El Guardián es Fuerte
            </h3>
            <p className="text-sm text-slate-300 max-w-sm mx-auto">
              No pasa nada, cada error es una oportunidad para aprender. Repasa con MendelMind IA e inténtalo de nuevo.
            </p>

            <button
              onClick={handleRestart}
              className="mt-4 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center space-x-2 mx-auto"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Volver a Intentar</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
