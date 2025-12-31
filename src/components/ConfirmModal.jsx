import React from "react";
import { AlertTriangle, CheckCircle, X } from "lucide-react";
import { clsx } from "clsx";

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Delete",
  cancelText = "Cancel",
  variant = "danger",
  showCancel = true,
  isLoading = false,
  loadingText = "Deleting...",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1e293b] w-full max-w-sm rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl animate-in zoom-in-95 duration-200 overflow-hidden transition-colors duration-300">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div
              className={clsx(
                "w-12 h-12 rounded-full flex items-center justify-center",
                variant === "danger"
                  ? "bg-danger/10 text-danger"
                  : variant === "success"
                  ? "bg-success/10 text-success"
                  : "bg-primary/10 text-primary"
              )}
            >
              {variant === "success" ? (
                <CheckCircle size={24} />
              ) : (
                <AlertTriangle size={24} />
              )}
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            {title}
          </h3>
          <p className="text-slate-500 dark:text-gray-400 text-sm mb-6">
            {message}
          </p>

          <div className="flex gap-3">
            {showCancel && (
              <button
                onClick={onClose}
                disabled={isLoading}
                className={clsx(
                  "flex-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-300 font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-all",
                  isLoading && "opacity-50 cursor-not-allowed"
                )}
              >
                {cancelText}
              </button>
            )}
            <button
              onClick={() => {
                if (!isLoading) {
                  onConfirm?.();
                }
              }}
              disabled={isLoading}
              className={clsx(
                "flex-1 px-4 py-2.5 rounded-xl text-white font-medium transition-all active:scale-95 shadow-lg flex items-center justify-center gap-2",
                isLoading && "opacity-70 cursor-not-allowed",
                variant === "danger"
                  ? "bg-danger hover:bg-danger/90 shadow-danger/20"
                  : variant === "success"
                  ? "bg-success hover:bg-success/90 shadow-success/20"
                  : "bg-primary hover:bg-primary/90 shadow-primary/20"
              )}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>{loadingText}</span>
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
