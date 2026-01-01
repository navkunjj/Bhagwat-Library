import React from "react";
import { X, Save, Edit2, Camera, Loader2 } from "lucide-react";
import { clsx } from "clsx";
import { saveStudent, getBatches, getStudents } from "../utils/store";
import { CameraCapture } from "./CameraCapture";

export const StudentForm = ({
  student,
  onClose,
  onSuccess,
  mode = "personal",
}) => {
  const [batches, setBatches] = React.useState([]);
  const [allStudents, setAllStudents] = React.useState([]);
  const [isCameraOpen, setIsCameraOpen] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Load batches and occupied seats first
  React.useEffect(() => {
    const load = async () => {
      const [batchData, studentData] = await Promise.all([
        getBatches(),
        getStudents(),
      ]);
      setBatches(batchData);
      setAllStudents(studentData);
    };
    load();
  }, []);

  const [formData, setFormData] = React.useState({
    name: student?.name || "",
    batch: Array.isArray(student?.batch)
      ? student.batch
      : student?.batch
      ? [student.batch]
      : [], // Initialize as array
    phone: student?.phone || "",
    address: student?.address || "",
    admissionDate:
      student?.admissionDate || new Date().toISOString().split("T")[0],
    paidAmount: student?.id ? student?.paidAmount ?? 0 : 0, // Default to 0 for new students
    totalAmount: student?.totalAmount || "",
    status: student?.status || "Unpaid",
    photo: student?.photo || "",
    validityFrom: student?.validityFrom || "",
    validityTo: student?.validityTo || "",
    seatNumber: student?.seatNumber || 0,
  });

  // Calculate total fee based on selected batches
  React.useEffect(() => {
    if (batches.length > 0) {
      // If adding new student, total is sum of selected. If editing, we might need to be careful not to overwrite if custom?
      // For now, simple logic: Total = Sum of selected batches.
      const selectedBatches = batches.filter((b) =>
        formData.batch.includes(b.time)
      );
      const total = selectedBatches.reduce(
        (sum, b) => sum + Number(b.price),
        0
      );
      setFormData((prev) => ({ ...prev, totalAmount: total }));
    }
  }, [formData.batch, batches]);

  // Calculate status dynamically & Auto-set Validity
  React.useEffect(() => {
    const paid = Number(formData.paidAmount) || 0;
    const total = Number(formData.totalAmount) || 0;
    const status =
      paid >= total && total > 0 ? "Paid" : paid > 0 ? "Partial" : "Unpaid";

    setFormData((prev) => {
      const updates = {};
      if (prev.status !== status) {
        updates.status = status;
      }

      // Auto-calculate validity when status becomes pure "Paid" (and it wasn't before effectively, or just constantly update if matches logic?)
      // Requirement: "validity one month after from that to that"
      // Let's do it when condition is met and fields are empty OR just when paid matches total.
      // To avoid annoying overwrites, we can check if it's a fresh change or user input.
      // But user requested "add validity one month after".
      // Simple UX: If paid >= total, and validity dates are not set (or we want to suggest them), set them.
      // Let's do: If status is Paid, and validityFrom is empty, set Today. If validityTo is empty, set Today + 1 month.

      if (status === "Paid" && (!prev.validityFrom || !prev.validityTo)) {
        const today = new Date();
        const nextMonth = new Date(today);
        nextMonth.setMonth(nextMonth.getMonth() + 1);

        if (!prev.validityFrom)
          updates.validityFrom = today.toISOString().split("T")[0];
        if (!prev.validityTo)
          updates.validityTo = nextMonth.toISOString().split("T")[0];
      }

      return Object.keys(updates).length > 0 ? { ...prev, ...updates } : prev;
    });
  }, [formData.paidAmount, formData.totalAmount]);

  // Auto-calculate Validity To when From changes
  React.useEffect(() => {
    if (formData.validityFrom) {
      const fromDate = new Date(formData.validityFrom);
      const toDate = new Date(fromDate);
      toDate.setMonth(toDate.getMonth() + 1);

      const newToDate = toDate.toISOString().split("T")[0];
      if (formData.validityTo !== newToDate) {
        setFormData((prev) => ({ ...prev, validityTo: newToDate }));
      }
    }
  }, [formData.validityFrom]);

  const handleBatchToggle = (batchTime) => {
    setFormData((prev) => {
      const currentBatches = prev.batch;
      if (currentBatches.includes(batchTime)) {
        return {
          ...prev,
          batch: currentBatches.filter((b) => b !== batchTime),
        };
      } else {
        return { ...prev, batch: [...currentBatches, batchTime] };
      }
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 500 * 1024) {
        alert("File size too large. Please select an image under 500KB.");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const data = {
        ...formData,
        id: student?.id,
        paidAmount: Number(formData.paidAmount),
        totalAmount: Number(formData.totalAmount),
      };
      console.log("Sending data:", data);
      await saveStudent(data);
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving student:", error);
      alert("Failed to save student. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const restFee = Math.max(
    0,
    (Number(formData.totalAmount) || 0) - (Number(formData.paidAmount) || 0)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/5 sticky top-0 bg-white dark:bg-[#1e293b] z-10 transition-colors duration-300">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            {mode === "payment"
              ? "Edit Payment Details"
              : student
              ? "Edit Student"
              : "Add New Student"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Personal Mode: Photo Upload & Camera. Payment Mode: Read-only Photo */}
          <div className="flex justify-center mb-4">
            <div className="relative group">
              <div
                className={clsx(
                  "w-24 h-24 rounded-full overflow-hidden bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center transition-all",
                  mode === "personal" && "group-hover:border-primary/50"
                )}
              >
                {formData.photo ? (
                  <img
                    src={formData.photo}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-slate-400 dark:text-gray-400 text-xs text-center px-2">
                    {mode === "personal" ? "No Photo" : "No Photo"}
                  </div>
                )}

                {mode === "personal" && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex flex-col items-center gap-1">
                      <Edit2 size={16} className="text-white" />
                      <span className="text-[10px] text-white font-medium">
                        Change
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {mode === "personal" && (
                <>
                  {/* File Upload Hidden Input */}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                    title="Upload from computer"
                  />

                  {/* Camera Quick Action */}
                  <button
                    type="button"
                    onClick={() => setIsCameraOpen(true)}
                    className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-[#1e293b] hover:scale-110 active:scale-95 transition-all z-20"
                    title="Take photo with camera"
                  >
                    <Camera size={14} />
                  </button>
                </>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              readOnly={mode === "payment"}
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className={clsx(
                "w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-gray-600",
                mode === "personal"
                  ? "focus:ring-2 focus:ring-primary/50"
                  : "cursor-not-allowed text-slate-400 dark:text-gray-400"
              )}
              placeholder="e.g. John Doe"
            />
          </div>

          {mode === "personal" && (
            <>
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-600"
                  placeholder="e.g. 1234567890"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">
                  Address
                </label>
                <textarea
                  required
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-600 resize-none h-24"
                  placeholder="e.g. 123 Main St, Area"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">
                  Admission Date
                </label>
                <input
                  type="date"
                  required
                  value={formData.admissionDate}
                  onChange={(e) =>
                    setFormData({ ...formData, admissionDate: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </>
          )}

          {/* Seat Number Scrollable Dial */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-slate-500 dark:text-gray-400">
                Choose Seat Number
              </label>
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold ring-1 ring-primary/20">
                Seat: {formData.seatNumber > 0 ? formData.seatNumber : "None"}
              </span>
            </div>

            <div className="relative group">
              <div className="overflow-x-auto custom-scrollbar-hidden py-4 flex gap-3 snap-x scroll-smooth">
                {/* None Option */}
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, seatNumber: 0 })}
                  className={clsx(
                    "flex-shrink-0 w-12 h-12 rounded-xl border flex items-center justify-center transition-all snap-center",
                    formData.seatNumber === 0
                      ? "bg-primary text-white border-primary shadow-lg shadow-primary/25 scale-110"
                      : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-400 hover:border-primary/50"
                  )}
                >
                  <span className="text-xs font-medium">None</span>
                </button>

                {/* 1 to 100 */}
                {Array.from({ length: 100 }, (_, i) => i + 1).map((n) => {
                  const occupant = allStudents.find(
                    (s) => s.seatNumber === n && s.id !== student?.id
                  );
                  const isOccupied = !!occupant;

                  return (
                    <div key={n} className="flex-shrink-0 relative group/seat">
                      <button
                        type="button"
                        disabled={isOccupied}
                        onClick={() =>
                          setFormData({ ...formData, seatNumber: n })
                        }
                        className={clsx(
                          "w-12 h-12 rounded-xl border flex items-center justify-center transition-all snap-center",
                          formData.seatNumber === n
                            ? "bg-primary text-white border-primary shadow-lg shadow-primary/25 scale-110 font-bold"
                            : isOccupied
                            ? "bg-danger/20 border-danger/30 text-danger cursor-not-allowed"
                            : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-gray-400 hover:border-primary/50"
                        )}
                      >
                        {n}
                      </button>
                      {isOccupied && (
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover/seat:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none shadow-xl">
                          Occupied by {occupant.name}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Fade masks */}
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-white dark:from-[#1e293b] to-transparent pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-white dark:from-[#1e293b] to-transparent pointer-events-none" />
            </div>

            <p className="text-[10px] text-slate-400 dark:text-gray-500 mt-2 text-center italic">
              {allStudents.length > 0
                ? "← Scroll to choose a seat (Red = Occupied) →"
                : "Loading seats..."}
            </p>
          </div>

          {/* Batch Selection - Multi-select for Personal, Read-only for Payment */}
          <div>
            <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-2">
              Batches
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar p-1">
              {batches.map((b) => (
                <label
                  key={b.id}
                  className={clsx(
                    "flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer",
                    formData.batch.includes(b.time)
                      ? "bg-primary/10 border-primary/50"
                      : "bg-slate-50 dark:bg-white/5 border-slate-200 dark:border-white/10 hover:border-primary/20 dark:hover:border-white/20"
                  )}
                >
                  <input
                    type="checkbox"
                    disabled={mode === "payment"}
                    checked={formData.batch.includes(b.time)}
                    onChange={() => handleBatchToggle(b.time)}
                    className="w-5 h-5 rounded border-gray-600 text-primary focus:ring-primary/50 bg-gray-700"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {b.time}
                    </div>
                    <div className="text-xs text-slate-500 dark:text-gray-400">
                      ₹{b.price}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">
                Total Fee
              </label>
              <input
                type="number"
                readOnly
                value={formData.totalAmount}
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-400 dark:text-gray-500 focus:outline-none cursor-not-allowed"
                placeholder="Auto-filled"
              />
            </div>
            {/* Paid Amount - Always visible/editable now as requested */}
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">
                Paid Amount
              </label>
              <input
                type="number"
                required
                min="0"
                value={formData.paidAmount}
                onChange={(e) =>
                  setFormData({ ...formData, paidAmount: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-600"
                placeholder="₹ 0"
              />
            </div>

            {/* Validity Dates - Visible if fields exist or manually added */}
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">
                Validity From
              </label>
              <input
                type="date"
                value={formData.validityFrom}
                onChange={(e) =>
                  setFormData({ ...formData, validityFrom: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">
                Validity To
              </label>
              <input
                type="date"
                value={formData.validityTo}
                onChange={(e) =>
                  setFormData({ ...formData, validityTo: e.target.value })
                }
                className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-white/5 rounded-xl p-4 flex items-center justify-between border border-slate-100 dark:border-none">
            <div className="flex flex-col">
              <span className="text-xs text-slate-500 dark:text-gray-400">
                Status
              </span>
              <span
                className={clsx(
                  "font-bold",
                  formData.status === "Paid" ? "text-success" : "text-danger"
                )}
              >
                {formData.status}
              </span>
            </div>
            <div className="flex flex-col text-right">
              <span className="text-xs text-slate-500 dark:text-gray-400">
                Balance Due
              </span>
              <span className="font-bold text-slate-900 dark:text-white">
                ₹{restFee}
              </span>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="ml-2">Saving...</span>
                </>
              ) : (
                <>
                  <Save size={18} />
                  <span className="ml-2">Save Student</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {isCameraOpen && (
        <CameraCapture
          onCapture={(photo) => setFormData((prev) => ({ ...prev, photo }))}
          onClose={() => setIsCameraOpen(false)}
        />
      )}
    </div>
  );
};
