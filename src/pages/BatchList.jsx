import React from "react";
import { Plus, Edit2, Trash2, Save, X, Clock, IndianRupee } from "lucide-react";
import { getBatches, saveBatch, deleteBatch } from "../utils/store";
import { clsx } from "clsx";
import { Loader } from "../components/Loader";
import { ConfirmModal } from "../components/ConfirmModal";

export const BatchList = () => {
  const [batches, setBatches] = React.useState([]);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingBatch, setEditingBatch] = React.useState(null);
  const [formData, setFormData] = React.useState({ time: "", price: "" });
  const [loading, setLoading] = React.useState(true);
  const [batchToDelete, setBatchToDelete] = React.useState(null);

  const loadBatches = async () => {
    setBatches(await getBatches());
    setLoading(false);
  };

  React.useEffect(() => {
    loadBatches();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...formData,
      id: editingBatch?.id,
    };
    await saveBatch(data);
    setIsFormOpen(false);
    setEditingBatch(null);
    setFormData({ time: "", price: "" });
    loadBatches();
  };

  const handleEdit = (batch) => {
    setEditingBatch(batch);
    setFormData({ time: batch.time, price: batch.price });
    setIsFormOpen(true);
  };

  const handleDelete = async () => {
    if (batchToDelete) {
      await deleteBatch(batchToDelete);
      loadBatches();
      setBatchToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
          Batch Management
        </h2>
        <button
          onClick={() => {
            setEditingBatch(null);
            setFormData({ time: "", price: "" });
            setIsFormOpen(true);
          }}
          className="bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all active:scale-95"
        >
          <Plus size={20} />
          Add Batch
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map((batch) => (
            <div
              key={batch.id}
              className="bg-white dark:bg-card border border-slate-200 dark:border-white/5 rounded-2xl p-5 hover:border-primary/20 dark:hover:border-white/10 transition-all group shadow-sm dark:shadow-none"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 text-primary bg-primary/10 px-3 py-1 rounded-lg">
                  <Clock size={16} />
                  <span className="font-medium text-sm">Batch Timing</span>
                </div>
                <div className="flex gap-2 transition-opacity">
                  <button
                    onClick={() => handleEdit(batch)}
                    className="p-1.5 text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => setBatchToDelete(batch.id)}
                    className="p-1.5 text-slate-400 dark:text-gray-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                {batch.time}
              </h3>

              <div className="flex items-center gap-2 text-slate-400 dark:text-gray-400">
                <IndianRupee size={16} />
                <span className="text-2xl font-bold text-success/90">
                  {batch.price}
                </span>
                <span className="text-xs">/ month</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white dark:bg-[#1e293b] w-full max-w-md rounded-2xl border border-slate-200 dark:border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-white/5">
              <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                {editingBatch ? "Edit Batch" : "Add New Batch"}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">
                  Batch Timing (e.g. 6am - 10am)
                </label>
                <input
                  type="text"
                  required
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-600"
                  placeholder="Start Time - End Time"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-500 dark:text-gray-400 mb-1">
                  Investment / Price (₹)
                </label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl px-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-600"
                  placeholder="500"
                />
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <Save size={18} />
                  Save Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={!!batchToDelete}
        onClose={() => setBatchToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Batch"
        message="Are you sure you want to delete this batch? This will affect all students assigned to this timing."
        confirmText="Delete Batch"
      />
    </div>
  );
};
