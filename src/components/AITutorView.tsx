import React, { useState, useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import {
  Brain,
  Send,
  Sparkles,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Lightbulb,
  CheckCircle2,
  Smile,
  GraduationCap,
} from "lucide-react";
import { CourseName } from "../types";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  subject?: string;
}

export const AITutorView: React.FC = () => {
  const { profile, addXP } = useApp();
  const [selectedSubject, setSelectedSubject] = useState<CourseName>("Matemática");
  const [inputQuestion, setInputQuestion] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const subjects: CourseName[] = [
    "Matemática",
    "Comunicación",
    "Ciencia y Tecnología",
    "Personal Social",
    "Inglés",
    "Arte y Cultura",
  ];

  const quickPrompts: Record<CourseName, string[]> = {
    Matemática: [
      "¿Cómo sumo fracciones con diferente denominador con un ejemplo?",
      "No entiendo cómo convertir un decimal a fracción",
      "Explícame qué es el área y el perímetro con un dibujo imaginario",
      "¿Cómo resuelvo una regla de tres simple para mi tarea?",
    ],
    Comunicación: [
      "¿Cómo identifico el sujeto y el predicado en una oración larga?",
      "Dame 3 ejemplos de conectores de causa y consecuencia",
      "¿Cuándo una palabra lleva tilde diacrítica?",
      "Ayúdame a redactar el inicio de un cuento de aventuras",
    ],
    "Ciencia y Tecnología": [
      "¿Cuáles son las diferencias entre una célula animal y una vegetal?",
      "Explícame el ciclo del agua de forma divertida",
      "¿Qué es la fotosíntesis y qué organelo la realiza?",
      "¿Cómo funciona una cadena trófica en el mar peruano?",
    ],
    "Personal Social": [
      "¿Cuáles fueron los aportes principales de la cultura Paracas?",
      "Explícame las 8 regiones naturales del Perú",
      "¿Qué derechos tenemos los niños según la convención?",
      "¿Por qué fue importante la proclamación de la independencia?",
    ],
    Inglés: [
      "¿Cómo uso 'do' y 'does' en presente simple?",
      "Explícame cómo describir mi rutina diaria en inglés",
      "3 oraciones usando 'there is' y 'there are'",
    ],
    "Educación Física": [
      "¿Por qué es importante calentar antes de hacer deporte?",
      "¿Cuántos vasos de agua debo tomar al entrenar?",
    ],
    "Arte y Cultura": [
      "¿Qué son los colores primarios y secundarios?",
      "Ideas para hacer una maqueta con materiales reciclados",
    ],
  };

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      sender: "ai",
      text: `¡Hola, ${profile?.name || "amigo"}! 🌟 Soy tu tutor personal **MendelMind IA** para 6.º de primaria.\n\nEstoy aquí para guiarte paso a paso con tus tareas, explicarte conceptos difíciles, darte pistas geniales y ayudarte a comprender sin darte solo la respuesta final.\n\n¿Qué tema te gustaría repasar hoy? Elige una materia arriba o escribe tu pregunta. ¡Vamos a aprender juntos! 💪✨`,
      timestamp: "Ahora",
      subject: "General",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (customText?: string) => {
    const query = (customText || inputQuestion).trim();
    if (!query || isLoading) return;

    const userMessage: Message = {
      id: "msg-" + Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      subject: selectedSubject,
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!customText) setInputQuestion("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/gemini/tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: query,
          subject: selectedSubject,
          studentName: profile?.name || "Estudiante",
        }),
      });

      const data = await response.json();
      const replyText =
        data.reply ||
        data.fallback ||
        "¡Qué buena pregunta! Recuerda que en 6.° de primaria revisamos este tema paso a paso. ¿Qué parte te parece más retadora?";

      const aiMessage: Message = {
        id: "ai-" + Date.now(),
        sender: "ai",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        subject: selectedSubject,
      };

      setMessages((prev) => [...prev, aiMessage]);
      addXP(15, "Consulta pedagógica con MendelMind IA");
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: "ai-err-" + Date.now(),
          sender: "ai",
          text: "Hubo un pequeño contratiempo al conectar con el servidor, pero aquí está el consejo clave: divide el problema en partes pequeñas y revisa los datos dados. ¡Prueba a reformular tu duda!",
          timestamp: "Ahora",
          subject: selectedSubject,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: "welcome-reset",
        sender: "ai",
        text: `¡Nuevo tema listo! ¿Sobre qué quieres investigar en **${selectedSubject}** hoy, ${profile?.name}? Pregúntame lo que quieras. 🚀`,
        timestamp: "Ahora",
        subject: selectedSubject,
      },
    ]);
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-teal-400 p-0.5 shadow-md flex items-center justify-center">
            <div className="w-full h-full bg-slate-900/10 rounded-[14px] flex items-center justify-center">
              <Brain className="w-8 h-8 text-white animate-bounce" />
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-extrabold text-slate-900 font-heading">
                MendelMind IA: Tu Tutor Escolar
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                Pedagógico
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Aprende el procedimiento paso a paso. No damos solo respuestas directas, ¡te enseñamos a pensar!
            </p>
          </div>
        </div>

        <button
          onClick={handleResetChat}
          className="self-start md:self-auto px-3 py-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center space-x-1.5 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reiniciar chat</span>
        </button>
      </div>

      {/* Subject Pill Selector */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {subjects.map((sub) => {
          const isSelected = selectedSubject === sub;
          return (
            <button
              key={sub}
              onClick={() => setSelectedSubject(sub)}
              className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isSelected
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {sub}
            </button>
          );
        })}
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
        {/* Messages list */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
          {messages.map((msg) => {
            const isUser = msg.sender === "user";
            return (
              <div
                key={msg.id}
                className={`flex items-start space-x-3 ${isUser ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                <div
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center shrink-0 text-white font-bold text-sm shadow-xs ${
                    isUser
                      ? "bg-gradient-to-br from-blue-600 to-indigo-600"
                      : "bg-gradient-to-tr from-indigo-500 to-teal-400"
                  }`}
                >
                  {isUser ? profile?.name?.charAt(0) || "U" : <Brain className="w-5 h-5" />}
                </div>

                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-3xl p-4 sm:p-5 shadow-xs ${
                    isUser
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-slate-50 border border-slate-100 text-slate-800 rounded-tl-none"
                  }`}
                >
                  {!isUser && (
                    <div className="flex items-center space-x-2 mb-2 pb-1.5 border-b border-slate-200/50">
                      <span className="text-[11px] font-extrabold text-blue-600 uppercase tracking-wider">
                        MendelMind IA ({msg.subject || selectedSubject})
                      </span>
                      <span className="text-[10px] text-slate-400">{msg.timestamp}</span>
                    </div>
                  )}

                  <div className="text-sm leading-relaxed whitespace-pre-line">
                    {msg.text}
                  </div>

                  {isUser && (
                    <div className="text-[10px] text-blue-100 text-right mt-1.5 font-medium">
                      {msg.timestamp}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="w-9 h-9 rounded-2xl bg-indigo-500 text-white flex items-center justify-center shadow-xs">
                <Brain className="w-5 h-5 animate-pulse" />
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-3xl rounded-tl-none p-4 shadow-xs flex items-center space-x-2">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" />
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-100" />
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce delay-200" />
                <span className="text-xs font-semibold text-slate-500 ml-2">
                  MendelMind IA está preparando una explicación clara...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Suggestions */}
        <div className="px-4 py-2.5 bg-slate-50/80 border-t border-slate-100 flex items-center space-x-2 overflow-x-auto scrollbar-none">
          <span className="text-xs font-bold text-slate-400 shrink-0 flex items-center space-x-1">
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Pistas rápidas:</span>
          </span>
          {(quickPrompts[selectedSubject] || quickPrompts.Matemática).map((prompt, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(prompt)}
              className="text-xs font-medium px-3 py-1.5 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 rounded-full border border-slate-200/80 whitespace-nowrap transition-colors shadow-2xs"
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white border-t border-slate-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-3"
          >
            <input
              type="text"
              id="ai-tutor-input"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder={`Escribe tu duda de ${selectedSubject}... (Ej: "¿Cómo resuelvo fracciones?")`}
              disabled={isLoading}
              className="flex-1 px-4 py-3 rounded-2xl bg-slate-100 border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm text-slate-800 transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              id="ai-tutor-submit"
              disabled={!inputQuestion.trim() || isLoading}
              className="px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center space-x-2 transition-all"
            >
              <span>Enviar</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
          <p className="text-[11px] text-slate-400 text-center mt-2">
            MendelMind IA promueve el aprendizaje autónomo para 6.º de primaria guiando el razonamiento.
          </p>
        </div>
      </div>
    </div>
  );
};
