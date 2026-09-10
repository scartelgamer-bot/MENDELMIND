import React, { useState } from "react";
import { Lock, X, ShieldAlert } from "lucide-react";
import { useApp } from "../context/AppContext";

interface ParentPinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const ParentPinModal: React.FC<ParentPinModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { profile } = useApp();
  const [pin, setPin] = useState("");
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPin = profile?.parentPin || "1234";

    if (pin === correctPin) {
      setError(false);
      setPin("");
      onSuccess();
    } else {
      setError(true);
      setPin("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-slate-200 shadow-2xl space-y-5 animate-scale-up relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-black text-slate-900 font-heading">
            Acceso para Padres o Tutores
          </h3>
          <p className="text-xs text-slate-500">
            Ingresa tu código PIN de 4 dígitos para acceder al panel de control y aprobación de recompensas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              maxLength={4}
              value={pin}
              autoFocus
              onChange={(e) => {
                setError(false);
                setPin(e.target.value);
              }}
              placeholder="••••"
              className="w-full tracking-widest text-center text-3xl font-black py-3 rounded-2xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-amber-600"
            />
            {error && (
              <p className="text-xs font-bold text-rose-600 text-center mt-2 flex items-center justify-center space-x-1">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>PIN incorrecto. (PIN demo: 1234)</span>
              </p>
            )}
            {!error && (
              <p className="text-[11px] text-slate-400 text-center mt-2">
                PIN de demostración predeterminado: <strong>1234</strong>
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-extrabold text-sm shadow-md transition-colors"
          >
            Entrar a Control Parental
          </button>
        </form>
      </div>
    </div>
  );
};
