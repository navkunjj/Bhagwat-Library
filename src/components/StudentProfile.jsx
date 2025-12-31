import React from "react";
import {
  X,
  User,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  Edit2,
  Check,
  XCircle,
  Armchair,
  FileText,
} from "lucide-react";
import { clsx } from "clsx";
import { updateStudentPayment, calculateValidity } from "../utils/store";
import { Invoice } from "./Invoice";

export const StudentProfile = ({ student, onClose, onUpdate, onEdit }) => {
  const [isEditingPayment, setIsEditingPayment] = React.useState(false);
  const [paidAmount, setPaidAmount] = React.useState(student?.paidAmount || 0);
  const [error, setError] = React.useState("");
  const [showInvoice, setShowInvoice] = React.useState(false);

  if (!student) return null;

  // Handle batch display (string or array)
  const batchDisplay = Array.isArray(student.batch)
    ? student.batch.join(", ")
    : student.batch;

  const handleSavePayment = async () => {
    // Validate
    const amount = parseFloat(paidAmount);
    if (isNaN(amount) || amount < 0) {
      setError("Please enter a valid amount");
      return;
    }
    if (amount > student.totalAmount) {
      setError("Paid amount cannot exceed total amount");
      return;
    }

    // Update payment
    const updatedStudent = await updateStudentPayment(student.id, amount);
    if (updatedStudent) {
      setIsEditingPayment(false);
      setError("");
      // Notify parent to refresh data
      onUpdate?.();
    }
  };

  const handleCancelEdit = () => {
    setPaidAmount(student.paidAmount);
    setIsEditingPayment(false);
    setError("");
  };

  const balance = Math.max(0, student.totalAmount - paidAmount);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto custom-scrollbar transition-colors duration-300">
        {/* Header */}
        <div className="relative">
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button
              onClick={() => setShowInvoice(true)}
              className="p-2 bg-black/10 dark:bg-black/20 hover:bg-black/30 dark:hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
              title="View Invoice"
            >
              <FileText size={20} />
            </button>
            <button
              onClick={onEdit}
              className="p-2 bg-black/10 dark:bg-black/20 hover:bg-black/30 dark:hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
              title="Edit full profile"
            >
              <Edit2 size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-black/10 dark:bg-black/20 hover:bg-black/30 dark:hover:bg-black/40 text-white rounded-full backdrop-blur-md transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="h-32 bg-gradient-to-r from-primary/10 to-purple-500/10 dark:from-primary/20 dark:to-purple-500/20 w-full" />
          <div className="absolute -bottom-12 left-6">
            <div className="w-24 h-24 rounded-full border-4 border-white dark:border-[#1e293b] bg-white dark:bg-[#1e293b] overflow-hidden flex items-center justify-center shadow-lg transition-colors">
              {student.photo ? (
                <img
                  src={student.photo}
                  alt={student.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 dark:text-gray-400">
                  <User size={40} />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-16 pb-6 px-6 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              {student.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={clsx(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                  student.paidAmount >= student.totalAmount &&
                    student.totalAmount > 0
                    ? "bg-success/10 text-success border-success/20"
                    : student.paidAmount > 0 &&
                      student.paidAmount < student.totalAmount
                    ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                    : "bg-danger/10 text-danger border-danger/20"
                )}
              >
                {student.paidAmount >= student.totalAmount &&
                student.totalAmount > 0
                  ? "Paid"
                  : student.paidAmount > 0
                  ? "Partial"
                  : "Unpaid"}
              </span>
              <span className="text-slate-400 dark:text-gray-400 text-sm">
                • {batchDisplay}
              </span>
            </div>
          </div>

          <div className="space-y-4 text-slate-600 dark:text-gray-300">
            <div className="flex items-start gap-3">
              <Phone size={18} className="mt-1 text-primary" />
              <div>
                <p className="text-xs text-slate-400 dark:text-gray-500">
                  Phone Number
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {student.phone}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin size={18} className="mt-1 text-primary" />
              <div>
                <p className="text-xs text-slate-400 dark:text-gray-500">
                  Address
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {student.address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar size={18} className="mt-1 text-primary" />
              <div>
                <p className="text-xs text-slate-400 dark:text-gray-500">
                  Admission Date
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {student.admissionDate}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Armchair size={18} className="mt-1 text-primary" />
              <div>
                <p className="text-xs text-slate-400 dark:text-gray-500">
                  Seat Number
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {student.seatNumber > 0 ? student.seatNumber : "Not assigned"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Calendar size={18} className="mt-1 text-primary" />
              <div>
                <p className="text-xs text-slate-400 dark:text-gray-500">
                  Validity
                </p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {student.validityFrom && student.validityTo ? (
                    <span className="text-sm">
                      {student.validityFrom}{" "}
                      <span className="text-slate-400">to</span>{" "}
                      {student.validityTo}
                    </span>
                  ) : (
                    <span className="text-slate-400 italic text-sm">
                      Not set
                    </span>
                  )}
                </p>
              </div>
            </div>

            {/* Fee Details */}
            <div className="p-4 bg-slate-50 dark:bg-white/5 rounded-xl space-y-3 border border-slate-100 dark:border-white/5 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-semibold">
                  <CreditCard size={18} />
                  <h3>Fee Details</h3>
                </div>
                {!isEditingPayment && (
                  <button
                    onClick={() => setIsEditingPayment(true)}
                    className="p-1.5 text-slate-400 dark:text-gray-400 hover:text-primary hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                    title="Edit payment"
                  >
                    <Edit2 size={16} />
                  </button>
                )}
              </div>

              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500 dark:text-gray-400">
                  Total Fee
                </span>
                <span className="text-slate-900 dark:text-white font-medium">
                  ₹{student.totalAmount}
                </span>
              </div>

              {isEditingPayment ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 dark:text-gray-400">
                      Paid Amount
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900 dark:text-white">₹</span>
                      <input
                        type="number"
                        value={paidAmount}
                        onChange={(e) => {
                          setPaidAmount(e.target.value);
                          setError("");
                        }}
                        className="w-24 bg-white dark:bg-white/10 border border-slate-200 dark:border-white/20 rounded px-2 py-1 text-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                        min="0"
                        max={student.totalAmount}
                        step="1"
                      />
                    </div>
                  </div>
                  {error && <p className="text-xs text-danger">{error}</p>}
                  <div className="flex gap-2">
                    <button
                      onClick={handleSavePayment}
                      className="flex-1 flex items-center justify-center gap-1 bg-success hover:bg-success/90 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      <Check size={14} />
                      Save
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="flex-1 flex items-center justify-center gap-1 bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-600 dark:text-gray-300 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    >
                      <XCircle size={14} />
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-500 dark:text-gray-400">
                    Paid Amount
                  </span>
                  <span className="text-success font-medium">
                    ₹{student.paidAmount}
                  </span>
                </div>
              )}

              <div className="border-t border-slate-100 dark:border-white/5 pt-2 flex justify-between items-center font-medium">
                <span className="text-slate-600 dark:text-gray-300">
                  Balance Due
                </span>
                <span
                  className={clsx(
                    balance > 0
                      ? "text-danger"
                      : "text-slate-400 dark:text-gray-400"
                  )}
                >
                  ₹{balance}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showInvoice && (
        <Invoice student={student} onClose={() => setShowInvoice(false)} />
      )}
    </div>
  );
};
