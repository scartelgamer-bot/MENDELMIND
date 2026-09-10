import React, { useState } from "react";
import { useApp } from "../context/AppContext";
import {
  CheckSquare,
  Calendar as CalendarIcon,
  Brain,
  Plus,
  Clock,
  AlertCircle,
  Sparkles,
  CheckCircle2,
  Trash2,
  CalendarDays,
  Flame,
  ArrowRight,
} from "lucide-react";
import { CourseName, TaskPriority, SchoolTask, StudyPlan } from "../types";

export const TasksAndPlanView: React.FC = () => {
  const {
    tasks,
    toggleTaskStatus,
    addTask,
    deleteTask,
    calendarEvents,
    addCalendarEvent,
    studyPlan,
    setStudyPlan,
    toggleStudyPlanDay,
    addXP,
    mastery,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"tasks" | "calendar" | "study-plan">("tasks");

  // New task form state
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskCourse, setTaskCourse] = useState<CourseName>("Matemática");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskPriority, setTaskPriority] = useState<TaskPriority>("Media");

  // New calendar event form state
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventCourse, setEventCourse] = useState<CourseName>("Ciencia y Tecnología");
  const [eventType, setEventType] = useState<"Examen" | "Tarea" | "Exposición" | "Proyecto">("Examen");
  const [eventDate, setEventDate] = useState("");
  const [eventDays, setEventDays] = useState(5);

  // AI plan generating state
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);

  const courses: CourseName[] = [
    "Matemática",
    "Comunicación",
    "Ciencia y Tecnología",
    "Personal Social",
    "Inglés",
    "Educación Física",
    "Arte y Cultura",
  ];

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    addTask({
      title: taskTitle.trim(),
      course: taskCourse,
      description: taskDesc.trim() || "Sin descripción adicional.",
      dueDate: taskDueDate || "Próxima semana",
      priority: taskPriority,
      status: "Pendiente",
      xpReward: 30,
      puntosReward: 20,
    });

    setTaskTitle("");
    setTaskDesc("");
    setTaskDueDate("");
    setShowTaskModal(false);
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventTitle.trim()) return;

    const recommendation =
      eventType === "Examen"
        ? `Tu ${eventTitle} es en ${eventDays} días. Te sugerimos estudiar 20 minutos diarios con MendelMind IA.`
        : `Organiza los avances de tu ${eventType} con 3 días de anticipación.`;

    addCalendarEvent({
      title: eventTitle.trim(),
      course: eventCourse,
      type: eventType,
      date: eventDate || "Fecha próxima",
      daysRemaining: Number(eventDays) || 3,
      aiRecommendation: recommendation,
    });

    setEventTitle("");
    setShowEventModal(false);
  };

  const handleGenerateSmartPlan = async () => {
    setIsGeneratingPlan(true);
    try {
      const response = await fetch("/api/gemini/study-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          upcomingExams: calendarEvents,
          tasks: tasks.filter((t) => t.status !== "Completada"),
          weakAreas: mastery
            .flatMap((c) => c.topics.filter((t) => t.level === "reforzar"))
            .map((t) => t.topic),
        }),
      });

      const data = await response.json();
      if (data && data.dailySchedule) {
        const newPlan: StudyPlan = {
          id: "plan-" + Date.now(),
          summary: data.summary || "Plan personalizado para maximizar tu rendimiento semanal.",
          weeklyTargetMinutes: data.weeklyTargetMinutes || 120,
          generatedAt: "Generado recién con IA",
          dailySchedule: data.dailySchedule.map((d: any) => ({
            ...d,
            completed: false,
          })),
        };
        setStudyPlan(newPlan);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto">
      {/* Header Tabs */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading flex items-center space-x-2">
            <span>Organización y Plan Escolar</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Gestiona tus tareas, calendario de exámenes y tu plan semanal inteligente con IA.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-2xl">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "tasks"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Mis Tareas ({tasks.length})
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "calendar"
                ? "bg-white text-blue-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Calendario ({calendarEvents.length})
          </button>
          <button
            onClick={() => setActiveTab("study-plan")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === "study-plan"
                ? "bg-white text-indigo-600 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Brain className="w-3.5 h-3.5 text-indigo-500" />
            <span>Mi Plan Inteligente</span>
          </button>
        </div>
      </div>

      {/* 1. TAB: MIS TAREAS */}
      {activeTab === "tasks" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tareas Escolares de 6.º de Primaria
            </p>
            <button
              onClick={() => setShowTaskModal(true)}
              className="px-4 py-2 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Nueva Tarea</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tasks.map((task) => {
              const isDone = task.status === "Completada";
              return (
                <div
                  key={task.id}
                  className={`p-5 rounded-3xl border transition-all ${
                    isDone
                      ? "bg-slate-50/70 border-slate-200 opacity-80"
                      : "bg-white border-slate-200/90 shadow-xs hover:shadow-md"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() => toggleTaskStatus(task.id)}
                        className={`mt-0.5 w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-colors ${
                          isDone
                            ? "border-emerald-500 bg-emerald-500 text-white"
                            : "border-slate-300 hover:border-blue-500"
                        }`}
                      >
                        {isDone && <CheckCircle2 className="w-4 h-4 text-white" />}
                      </button>

                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-blue-100 text-blue-800">
                            {task.course}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              task.priority === "Alta"
                                ? "bg-rose-100 text-rose-700"
                                : task.priority === "Media"
                                ? "bg-amber-100 text-amber-800"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {task.priority}
                          </span>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              isDone
                                ? "bg-emerald-100 text-emerald-800"
                                : task.status === "En progreso"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>

                        <h3
                          className={`font-bold text-base text-slate-900 ${
                            isDone ? "line-through text-slate-400" : ""
                          }`}
                        >
                          {task.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                          {task.description}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteTask(task.id)}
                      className="text-slate-300 hover:text-rose-500 transition-colors p-1"
                      title="Eliminar tarea"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-1 text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>Entrega: {task.dueDate}</span>
                    </div>

                    <span className="font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      +{task.xpReward} XP | +{task.puntosReward} pts
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 2. TAB: CALENDARIO ESCOLAR */}
      {activeTab === "calendar" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Exámenes y Evaluaciones Próximas
            </p>
            <button
              onClick={() => setShowEventModal(true)}
              className="px-4 py-2 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Fecha</span>
            </button>
          </div>

          <div className="space-y-3">
            {calendarEvents.map((evt) => (
              <div
                key={evt.id}
                className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex flex-col items-center justify-center shrink-0">
                    <CalendarDays className="w-5 h-5 text-indigo-600" />
                    <span className="text-[10px] font-bold mt-0.5">{evt.daysRemaining}d</span>
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-md bg-indigo-100 text-indigo-800">
                        {evt.type}
                      </span>
                      <span className="text-xs font-bold text-slate-600">
                        {evt.course}
                      </span>
                    </div>
                    <h3 className="font-extrabold text-base text-slate-900">{evt.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Fecha programada: {evt.date}</p>

                    {/* AI Recommendation */}
                    {evt.aiRecommendation && (
                      <div className="mt-2.5 p-3 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start space-x-2">
                        <Brain className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-bold">Recomendación IA:</strong> {evt.aiRecommendation}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-xl bg-amber-100 text-amber-800">
                    Faltan {evt.daysRemaining} días
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. TAB: MI PLAN INTELIGENTE (Section 15) */}
      {activeTab === "study-plan" && (
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 via-blue-600 to-sky-500 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-bold text-white">
                <Brain className="w-3.5 h-3.5 text-amber-300" />
                <span>Generado con MendelMind IA</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black font-heading">
                Mi Plan Inteligente Semanal
              </h2>
              <p className="text-blue-100 text-xs sm:text-sm leading-relaxed">
                {studyPlan.summary}
              </p>
              <div className="pt-2 flex items-center space-x-3 text-xs font-bold text-white/90">
                <span>Meta semanal: {studyPlan.weeklyTargetMinutes} min de estudio</span>
                <span>•</span>
                <span>{studyPlan.generatedAt}</span>
              </div>
            </div>

            <button
              onClick={handleGenerateSmartPlan}
              disabled={isGeneratingPlan}
              className="mt-6 px-5 py-2.5 rounded-2xl bg-white text-indigo-700 hover:bg-blue-50 font-extrabold text-xs sm:text-sm shadow-md flex items-center space-x-2 transition-all disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>{isGeneratingPlan ? "Analizando tu perfil escolar..." : "Regenerar Plan con IA"}</span>
            </button>
          </div>

          {/* Daily breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {studyPlan.dailySchedule.map((day, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-3xl border transition-all flex flex-col justify-between ${
                  day.completed
                    ? "bg-emerald-50/50 border-emerald-200"
                    : "bg-white border-slate-200/90 shadow-xs hover:shadow-sm"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-slate-900 text-sm">{day.day}</span>
                    <button
                      onClick={() => toggleStudyPlanDay(idx)}
                      className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${
                        day.completed
                          ? "bg-emerald-500 border-emerald-500 text-white"
                          : "border-slate-300 hover:border-emerald-500"
                      }`}
                    >
                      {day.completed && <CheckCircle2 className="w-4 h-4 text-white" />}
                    </button>
                  </div>

                  <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 mb-1.5">
                    {day.course}
                  </span>

                  <p className="font-bold text-xs text-slate-800 line-clamp-2">{day.topic}</p>
                  <p className="text-[11px] text-slate-500 mt-2 italic">“{day.tip}”</p>
                </div>

                <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-600 font-semibold">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{day.durationMinutes} min</span>
                  </span>
                  <span className="text-emerald-700 font-bold">+20 XP</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-scale-up">
            <h3 className="text-lg font-extrabold text-slate-900">Agregar Nueva Tarea</h3>
            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Título de la tarea</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Ejercicios de decimales página 45"
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Curso</label>
                  <select
                    value={taskCourse}
                    onChange={(e) => setTaskCourse(e.target.value as CourseName)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden"
                  >
                    {courses.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Prioridad</label>
                  <select
                    value={taskPriority}
                    onChange={(e) => setTaskPriority(e.target.value as TaskPriority)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden"
                  >
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Baja">Baja</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Fecha de entrega</label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-sm focus:outline-hidden"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Descripción / Indicaciones</label>
                <textarea
                  rows={2}
                  value={taskDesc}
                  onChange={(e) => setTaskDesc(e.target.value)}
                  placeholder="Detalles de la tarea que dio el profesor..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden"
                />
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
                >
                  Guardar Tarea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-slate-200 shadow-2xl space-y-4 animate-scale-up">
            <h3 className="text-lg font-extrabold text-slate-900">Añadir Evaluación o Evento</h3>
            <form onSubmit={handleCreateEvent} className="space-y-3">
              <div>
                <label className="text-xs font-bold text-slate-600 block mb-1">Nombre del evento</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Examen Bimestral de Comunicación"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Curso</label>
                  <select
                    value={eventCourse}
                    onChange={(e) => setEventCourse(e.target.value as CourseName)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden"
                  >
                    {courses.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Tipo</label>
                  <select
                    value={eventType}
                    onChange={(e) => setEventType(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-semibold focus:outline-hidden"
                  >
                    <option value="Examen">Examen</option>
                    <option value="Tarea">Tarea importante</option>
                    <option value="Exposición">Exposición</option>
                    <option value="Proyecto">Proyecto</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Fecha</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Días restantes</label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={eventDays}
                    onChange={(e) => setEventDays(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowEventModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-sm"
                >
                  Guardar Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
