import React, { useState } from "react";
import { AppProvider, useApp } from "./context/AppContext";
import { Header } from "./components/Header";
import { LandingHero } from "./components/LandingHero";
import { DashboardView } from "./components/DashboardView";
import { AITutorView } from "./components/AITutorView";
import { QuizGeneratorView } from "./components/QuizGeneratorView";
import { TasksAndPlanView } from "./components/TasksAndPlanView";
import { RewardsView } from "./components/RewardsView";
import { ProgressView } from "./components/ProgressView";
import { ParentalControlView } from "./components/ParentalControlView";
import { ParentPinModal } from "./components/ParentPinModal";
import { FocusTimerModal } from "./components/FocusTimerModal";
import { BossBattleModal } from "./components/BossBattleModal";
import { AuthModal } from "./components/AuthModal";
import { Brain, Heart, Sparkles } from "lucide-react";

const MainContent: React.FC = () => {
  const { isLoggedIn, isParentMode, setIsParentMode, activeTab } = useApp();
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);

  const handleOpenParentModal = () => {
    setIsPinModalOpen(true);
  };

  const handleParentPinSuccess = () => {
    setIsPinModalOpen(false);
    setIsParentMode(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-500 selection:text-white">
      {/* Navigation Header */}
      <Header onOpenParentModal={handleOpenParentModal} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!isLoggedIn ? (
          <LandingHero />
        ) : isParentMode ? (
          <ParentalControlView />
        ) : (
          <>
            {activeTab === "dashboard" && <DashboardView />}
            {activeTab === "ai-tutor" && <AITutorView />}
            {activeTab === "quizzes" && <QuizGeneratorView />}
            {activeTab === "tasks" && <TasksAndPlanView />}
            {activeTab === "rewards" && <RewardsView />}
            {activeTab === "progress" && <ProgressView />}
          </>
        )}
      </main>

      {/* Modals */}
      <ParentPinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSuccess={handleParentPinSuccess}
      />
      <FocusTimerModal />
      <BossBattleModal />
      <AuthModal />

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Brain className="w-3.5 h-3.5" />
            </div>
            <span className="font-extrabold text-slate-900 font-heading">MendelMind</span>
            <span>—</span>
            <span>Educación inteligente y hábitos digitales para 6.º de Primaria</span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Potenciado por IA Pedagógica</span>
            </span>
            <span>•</span>
            <span>Control Parental Integrado</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
