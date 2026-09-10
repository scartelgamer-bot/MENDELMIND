import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  Brain,
  Sparkles,
  CheckCircle2,
  XCircle,
  Clock,
  Trophy,
  Star,
  RotateCcw,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Zap,
  Target,
  AlertTriangle,
} from "lucide-react";
import { CourseName, QuizQuestion, QuizResult } from "../types";

export const QuizGeneratorView: React.FC = () => {
  const { profile, recordQuizResult, triggerCelebration } = useApp();

  // Generator form state
  const [course, setCourse] = useState<CourseName>("Matemática");
  const [topic, setTopic] = useState("Fracciones");
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState("Media");
  const [isGenerating, setIsGenerating] = useState(false);

  // Active Quiz State
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<QuizQuestion[] | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  const courseTopics: Record<CourseName, string[]> = {
    Matemática: [
      "Fracciones",
      "Decimales y operaciones",
      "Porcentajes",
      "Perímetros y Áreas",
      "Ecuaciones simples",
      "Regla de tres",
    ],
    Comunicación: [
      "Comprensión de textos",
      "Conectores lógicos",
      "Reglas de acentuación",
      "Sujeto y predicado",
      "Textos argumentativos",
    ],
    "Ciencia y Tecnología": [
      "La Célula y organelos",
      "Fotosíntesis y respiración",
      "Ecosistemas y cadenas tróficas",
      "Materia y energía",
      "El cuerpo humano",
    ],
    "Personal Social": [
      "Culturas Preincas",
      "Geografía y 8 regiones del Perú",
      "Derechos y deberes del niño",
      "Historia del Perú",
    ],
    Inglés: [
      "Present Simple & Daily Routine",
      "Vocabulary: School & Family",
      "Verb To Be & Pronouns",
      "Numbers & Colors",
    ],
    "Educación Física": [
      "Hábitos de vida saludable",
      "Reglas del básquetbol y fútbol",
      "Calentamiento y postura",
    ],
    "Arte y Cultura": [
      "Teoría del color",
      "Manifestaciones artísticas peruanas",
      "Técnicas de dibujo y pintura",
    ],
  };

  const handleGenerateQuiz = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch("/api/gemini/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course,
          topic,
          questionCount,
          difficulty,
        }),
      });

      const data = await response.json();
      const questions: QuizQuestion[] =
        data.questions && data.questions.length > 0
          ? data.questions
          : [
              {
                id: 1,
                type: "multiple_choice",
                question: "¿Cuál es la fracción equivalente a 2/4?",
                options: ["1/2", "3/4", "1/4", "4/2"],
                correctAnswer: "1/2",
                explanation: "Al simplificar 2/4 dividiendo entre 2 el numerador y denominador se obtiene 1/2.",
              },
              {
                id: 2,
                type: "true_false",
                question: "En las fracciones propias, el numerador siempre es menor que el denominador.",
                options: ["Verdadero", "Falso"],
                correctAnswer: "Verdadero",
                explanation: "Exacto, una fracción propia representa menos de un entero completo.",
              },
              {
                id: 3,
                type: "multiple_choice",
                question: "¿Cuánto es 3/8 + 2/8?",
                options: ["5/8", "5/16", "6/8", "1/8"],
                correctAnswer: "5/8",
                explanation: "Como tienen el mismo denominador, sumamos los numeradores: 3 + 2 = 5.",
              },
            ];

      setActiveQuizQuestions(questions);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      setQuizFinished(false);
      setQuizResult(null);
      setStartTime(Date.now());
    } catch (err) {
      console.error("Error generating quiz:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSelectAnswer = (ans: string) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: ans,
    }));
  };

  const handleNextQuestion = () => {
    if (!activeQuizQuestions) return;

    if (currentQuestionIndex < activeQuizQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Finish Quiz
      finishQuiz();
    }
  };

  const finishQuiz = () => {
    if (!activeQuizQuestions) return;

    const timeSpent = Math.round((Date.now() - startTime) / 1000);
    let correct = 0;
    const reviewList = activeQuizQuestions.map((q, idx) => {
      const userAns = userAnswers[idx] || "Sin responder";
      const isCorrect = userAns.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase();
      if (isCorrect) correct += 1;
      return {
        question: q.question,
        userAnswer: userAns,
        correctAnswer: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      };
    });

    const incorrect = activeQuizQuestions.length - correct;
    const percent = Math.round((correct / activeQuizQuestions.length) * 100);

    // Gamification points: 10 XP per correct + 20 XP bonus if >= 80%
    const earnedXP = correct * 12 + (percent >= 80 ? 25 : 10);
    const earnedPuntos = Math.round((correct * 8) + (percent >= 80 ? 15 : 5));

    const result: QuizResult = {
      id: "quiz-" + Date.now(),
      course,
      topic,
      totalQuestions: activeQuizQuestions.length,
      correctAnswers: correct,
      incorrectAnswers: incorrect,
      percentage: percent,
      timeSpentSeconds: timeSpent,
      xpEarned: earnedXP,
      papelPuntosEarned: earnedPuntos,
      date: new Date().toLocaleDateString(),
      weakTopics: percent < 75 ? [topic] : [],
      answersReview: reviewList,
    };

    setQuizResult(result);
    setQuizFinished(true);
    recordQuizResult(result);

    if (percent >= 70) {
      triggerCelebration();
    }
  };

  const handleRestart = () => {
    setActiveQuizQuestions(null);
    setQuizFinished(false);
    setQuizResult(null);
    setUserAnswers({});
    setCurrentQuestionIndex(0);
  };

  // 1. ACTIVE QUIZ RUNNER VIEW
  if (activeQuizQuestions && !quizFinished) {
    const q = activeQuizQuestions[currentQuestionIndex];
    const currentAns = userAnswers[currentQuestionIndex];
    const progressPercent = Math.round(((currentQuestionIndex + 1) / activeQuizQuestions.length) * 100);

    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        {/* Progress & Header */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
              {course} • {topic}
            </span>
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-500">
              <Clock className="w-4 h-4 text-blue-500" />
              <span>Pregunta {currentQuestionIndex + 1} de {activeQuizQuestions.length}</span>
            </div>
          </div>

          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {q.type === "multiple_choice"
                ? "Alternativa Múltiple"
                : q.type === "true_false"
                ? "Verdadero o Falso"
                : q.type === "fill_blank"
                ? "Completar la Oración"
                : "Pregunta"}
            </span>
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-snug">
              {q.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3">
            {q.options.map((option, idx) => {
              const isSelected = currentAns === option;
              const letter = String.fromCharCode(65 + idx); // A, B, C, D
              return (
                <button
                  key={idx}
                  onClick={() => handleSelectAnswer(option)}
                  className={`w-full p-4 rounded-2xl border text-left flex items-center space-x-4 transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span
                    className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${
                      isSelected
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {letter}
                  </span>
                  <span className="font-semibold text-sm sm:text-base flex-1">{option}</span>
                </button>
              );
            })}
          </div>

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={handleRestart}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>

            <button
              onClick={handleNextQuestion}
              disabled={!currentAns}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center space-x-2 transition-all"
            >
              <span>
                {currentQuestionIndex === activeQuizQuestions.length - 1
                  ? "Terminar Cuestionario"
                  : "Siguiente Pregunta"}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. QUIZ RESULT VIEW (Section 7 from spec)
  if (quizFinished && quizResult) {
    return (
      <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
        {/* Results Banner */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm text-center relative overflow-hidden">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-500 flex items-center justify-center text-white shadow-lg mb-4">
            <Trophy className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 font-heading">
            {quizResult.percentage >= 80
              ? "¡Excelente Trabajo! 🎉"
              : quizResult.percentage >= 60
              ? "¡Buen esfuerzo! Sigue practicando 💪"
              : "¡No te rindas! Vamos a repasar juntos 🧠"}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Cuestionario de <strong>{quizResult.course}</strong>: {quizResult.topic}
          </p>

          {/* Core Metrics: 8/10 correctas, 80%, +80 XP, +40 PapelPuntos */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-xs text-slate-500 font-medium">Aciertos</p>
              <p className="text-xl font-black text-slate-900 mt-0.5">
                {quizResult.correctAnswers} / {quizResult.totalQuestions}
              </p>
              <span className="text-[11px] font-bold text-emerald-600">correctas</span>
            </div>

            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-100">
              <p className="text-xs text-blue-700 font-medium">Puntaje</p>
              <p className="text-2xl font-black text-blue-600 mt-0.5">
                {quizResult.percentage} %
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-indigo-50 border border-indigo-100">
              <p className="text-xs text-indigo-700 font-medium">Recompensa XP</p>
              <p className="text-xl font-black text-indigo-600 mt-0.5">
                +{quizResult.xpEarned} XP
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-100">
              <p className="text-xs text-emerald-700 font-medium">PapelPuntos</p>
              <p className="text-xl font-black text-emerald-600 mt-0.5">
                +{quizResult.papelPuntosEarned} pts
              </p>
            </div>
          </div>

          {/* Time & Reinforcement banner */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-500">
            <span className="flex items-center space-x-1">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Tiempo empleado: {Math.floor(quizResult.timeSpentSeconds / 60)} min {quizResult.timeSpentSeconds % 60} seg</span>
            </span>
            {quizResult.weakTopics.length > 0 && (
              <span className="flex items-center space-x-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                <span>Tema sugerido para reforzar: {quizResult.weakTopics.join(", ")}</span>
              </span>
            )}
          </div>
        </div>

        {/* Detailed Review for every question */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-extrabold text-slate-900 text-lg">
              Revisión Pedagógica de Respuestas
            </h2>
            <span className="text-xs text-slate-500">
              Explicaciones paso a paso
            </span>
          </div>

          <div className="space-y-4">
            {quizResult.answersReview.map((item, idx) => (
              <div
                key={idx}
                className={`p-4 sm:p-5 rounded-2xl border transition-colors ${
                  item.isCorrect
                    ? "bg-emerald-50/40 border-emerald-100"
                    : "bg-rose-50/40 border-rose-200"
                }`}
              >
                <div className="flex items-start space-x-3">
                  {item.isCorrect ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}

                  <div className="flex-1 space-y-1.5">
                    <p className="text-xs font-bold text-slate-500">
                      Pregunta {idx + 1}: {item.isCorrect ? "¡Correcta! 🌟" : "Incorrecta ❌"}
                    </p>
                    <p className="font-bold text-slate-900 text-sm">{item.question}</p>

                    <div className="text-xs space-y-1 mt-2">
                      <p className="text-slate-600">
                        Tu respuesta:{" "}
                        <strong className={item.isCorrect ? "text-emerald-700" : "text-rose-700"}>
                          {item.userAnswer}
                        </strong>
                      </p>
                      {!item.isCorrect && (
                        <p className="text-slate-600">
                          Respuesta correcta:{" "}
                          <strong className="text-emerald-700">{item.correctAnswer}</strong>
                        </p>
                      )}
                    </div>

                    <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed">
                      💡 <strong>Explicación:</strong> {item.explanation}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
            <button
              onClick={handleRestart}
              className="px-5 py-3 rounded-2xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold flex items-center space-x-2 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Crear otro cuestionario</span>
            </button>

            <button
              onClick={() => {
                setActiveQuizQuestions(null);
                setQuizFinished(false);
                handleGenerateQuiz();
              }}
              className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 flex items-center space-x-2 transition-colors"
            >
              <Zap className="w-4 h-4" />
              <span>Reintentar con nuevas preguntas</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. GENERATOR SETUP FORM (Section 6 from spec)
  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Generador Inteligente</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-heading">
            Crear Cuestionario con IA
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
            MendelMind IA genera preguntas adaptadas a tu nivel de 6.º de primaria con opciones múltiples, verdadero/falso y completar. ¡Responde bien para ganar XP y PapelPuntos!
          </p>
        </div>
      </div>

      {/* Configuration Form Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
          <Target className="w-5 h-5 text-blue-600" />
          <span>Configura tu evaluación</span>
        </h2>

        {/* Course selection */}
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
            1. Selecciona el Curso
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
            {Object.keys(courseTopics).map((cName) => {
              const isSelected = course === cName;
              return (
                <button
                  key={cName}
                  onClick={() => {
                    setCourse(cName as CourseName);
                    setTopic(courseTopics[cName as CourseName][0]);
                  }}
                  className={`p-3 rounded-2xl border text-xs font-bold text-center transition-all ${
                    isSelected
                      ? "border-blue-600 bg-blue-50 text-blue-900 ring-2 ring-blue-500 shadow-xs"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  {cName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Topic selection */}
        <div>
          <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
            2. Selecciona el Tema
          </label>
          <div className="flex flex-wrap gap-2">
            {courseTopics[course].map((tName) => {
              const isSelected = topic === tName;
              return (
                <button
                  key={tName}
                  onClick={() => setTopic(tName)}
                  className={`px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all ${
                    isSelected
                      ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {tName}
                </button>
              );
            })}
          </div>
        </div>

        {/* Questions count & Difficulty */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
          {/* Question Count */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              3. Número de Preguntas
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[3, 5, 10].map((count) => {
                const isSelected = questionCount === count;
                return (
                  <button
                    key={count}
                    onClick={() => setQuestionCount(count)}
                    className={`py-2.5 rounded-xl border text-xs font-extrabold transition-all ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {count} preguntas
                  </button>
                );
              })}
            </div>
          </div>

          {/* Difficulty */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 mb-2">
              4. Dificultad
            </label>
            <div className="grid grid-cols-3 gap-2">
              {["Fácil", "Media", "Difícil"].map((diff) => {
                const isSelected = difficulty === diff;
                return (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`py-2.5 rounded-xl border text-xs font-extrabold transition-all ${
                      isSelected
                        ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {diff}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            Tipos de preguntas: Opción múltiple, Verdadero/Falso y Completar.
          </div>

          <button
            onClick={handleGenerateQuiz}
            disabled={isGenerating}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 hover:opacity-95 text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Brain className="w-5 h-5 animate-spin" />
                <span>Generando con MendelMind IA...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-amber-300" />
                <span>Generar y Empezar Cuestionario</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
