import React from "react";
import { Plus, Edit2, Trash2, Save, X, Clock, IndianRupee } from "lucide-react";
import { getBatches, saveBatch, deleteBatch } from "../utils/store";
import { clsx } from "clsx";
import { Loader } from "../components/Loader";

export const BatchList = () => {
  const [batches, setBatches] = React.useState([]);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingBatch, setEditingBatch] = React.useState(null);
  const [formData, setFormData] = React.useState({ time: "", price: "" });
  const [loading, setLoading] = React.useState(true);

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

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this batch?")) {
      await deleteBatch(id);
      loadBatches();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">Batch Management</h2>
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
              className="bg-card border border-white/5 rounded-2xl p-5 hover:border-white/10 transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2 text-primary bg-primary/10 px-3 py-1 rounded-lg">
                  <Clock size={16} />
                  <span className="font-medium text-sm">Batch Timing</span>
                </div>
                <div className="flex gap-2 transition-opacity">
                  <button
                    onClick={() => handleEdit(batch)}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(batch.id)}
                    className="p-1.5 text-gray-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <h3 className="text-lg font-bold text-white mb-2">
                {batch.time}
              </h3>

              <div className="flex items-center gap-2 text-gray-400">
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
          <div className="bg-[#1e293b] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <h2 className="text-xl font-bold text-white">
                {editingBatch ? "Edit Batch" : "Add New Batch"}
              </h2>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Batch Timing (e.g. 6am - 10am)
                </label>
                <input
                  type="text"
                  required
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-600"
                  placeholder="Start Time - End Time"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Investment / Price (₹)
                </label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-600"
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
    </div>
  );
};
