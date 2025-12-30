import React from "react";
import { Search, Plus, Edit2, Trash2, Users } from "lucide-react";
import { clsx } from "clsx";
import { getStudents, deleteStudent } from "../utils/store";
import { StudentForm } from "../components/StudentForm";
import { StudentProfile } from "../components/StudentProfile";
import { Loader } from "../components/Loader";
import { ConfirmModal } from "../components/ConfirmModal";

export const StudentList = () => {
  const [students, setStudents] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [editingStudent, setEditingStudent] = React.useState(null);
  const [viewingStudent, setViewingStudent] = React.useState(null);
  const [loading, setLoading] = React.useState(true);
  const [filterBatch, setFilterBatch] = React.useState("All");
  const [filterStatus, setFilterStatus] = React.useState("All");
  const [studentToDelete, setStudentToDelete] = React.useState(null);

  const loadStudents = async () => {
    setStudents(await getStudents());
    setLoading(false);
  };

  React.useEffect(() => {
    loadStudents();
  }, []);

  const handleDelete = async () => {
    if (studentToDelete) {
      await deleteStudent(studentToDelete);
      loadStudents();
      setStudentToDelete(null);
    }
  };

  const filteredStudents = students
    .filter((student) => {
      // Filter by Search
      const matchesSearch =
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phone.includes(searchTerm) ||
        (student.batch && student.batch.includes(searchTerm)); // Check if batch array includes term logic if needed, or join.

      // Logic above for batch array search might be weak if strict. Better:
      // const batchStr = Array.isArray(student.batch) ? student.batch.join(" ") : student.batch;
      // ... includes(searchTerm) ...

      // Filter by Status
      const studentStatus =
        student.status ||
        (student.paidAmount >= student.totalAmount && student.totalAmount > 0
          ? "Paid"
          : student.paidAmount > 0
          ? "Partial"
          : "Unpaid");
      const matchesStatus =
        filterStatus === "All" || studentStatus === filterStatus;

      return matchesSearch && matchesBatch && matchesStatus;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white dark:bg-card border border-slate-200 dark:border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-400 dark:placeholder:text-gray-600 shadow-sm dark:shadow-none"
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white dark:bg-card border border-slate-200 dark:border-white/5 text-slate-900 dark:text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer appearance-none shadow-sm dark:shadow-none"
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Partial">Partial</option>
            <option value="Unpaid">Unpaid</option>
          </select>
          <button
            onClick={() => {
              setEditingStudent(null);
              setIsFormOpen(true);
            }}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2.5 rounded-xl font-medium flex items-center gap-2 transition-all active:scale-95 whitespace-nowrap"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Add Student</span>
          </button>
        </div>
      </div>

      {/* Student Table */}
      <div className="bg-white dark:bg-card border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
        <div className="overflow-x-auto custom-scrollbar max-h-[calc(100vh-200px)] overflow-y-auto">
          <table className="w-full text-left min-w-[640px]">
            <thead className="bg-slate-50 dark:bg-white/5 text-slate-500 dark:text-gray-400 text-xs uppercase tracking-wider sticky top-0 z-10">
              <tr>
                <th className="px-4 md:px-6 py-4 font-medium">Student</th>
                <th className="px-4 md:px-6 py-4 font-medium">Phone</th>
                <th className="px-4 md:px-6 py-4 font-medium">Admission</th>
                <th className="px-4 md:px-6 py-4 font-medium">Status</th>
                <th className="px-4 md:px-6 py-4 font-medium">Address</th>
                <th className="px-4 md:px-6 py-4 font-medium text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredStudents.map((student) => {
                return (
                  <tr
                    key={student.id}
                    className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-4 md:px-6 py-4">
                      <div
                        onClick={() => setViewingStudent(student)}
                        className="flex items-center gap-3 cursor-pointer group/profile"
                      >
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-200 dark:border-white/10 group-hover/profile:border-primary/50 transition-colors">
                          {student.photo ? (
                            <img
                              src={student.photo}
                              alt={student.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Users
                              size={18}
                              className="text-slate-400 dark:text-gray-400 group-hover/profile:text-primary transition-colors"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900 dark:text-white group-hover/profile:text-primary transition-colors">
                            {student.name}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-slate-500 dark:text-gray-400">
                      {student.phone}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-slate-500 dark:text-gray-400">
                      {student.admissionDate || "-"}
                    </td>
                    <td className="px-4 md:px-6 py-4">
                      {(() => {
                        const status =
                          student.status ||
                          (student.paidAmount >= student.totalAmount &&
                          student.totalAmount > 0
                            ? "Paid"
                            : student.paidAmount > 0
                            ? "Partial"
                            : "Unpaid");
                        return (
                          <span
                            className={clsx(
                              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                              status === "Paid"
                                ? "bg-success/10 text-success border-success/20"
                                : status === "Partial"
                                ? "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                                : "bg-danger/10 text-danger border-danger/20"
                            )}
                          >
                            {status}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-sm text-slate-500 dark:text-gray-400 truncate max-w-[200px]">
                      {student.address}
                    </td>
                    <td className="px-4 md:px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 transition-opacity">
                        <button
                          onClick={() => {
                            setEditingStudent(student);
                            setIsFormOpen(true);
                          }}
                          className="p-2 text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => setStudentToDelete(student.id)}
                          className="p-2 text-slate-400 dark:text-gray-400 hover:text-danger hover:bg-danger/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filteredStudents.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search size={32} className="opacity-20" />
                      <p>No students found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Form Modal */}
      {isFormOpen && (
        <StudentForm
          student={editingStudent}
          mode="personal"
          onClose={() => setIsFormOpen(false)}
          onSuccess={() => {
            loadStudents();
            setIsFormOpen(false);
          }}
        />
      )}

      {/* Profile Modal */}
      {viewingStudent && (
        <StudentProfile
          student={viewingStudent}
          onClose={() => setViewingStudent(null)}
          onEdit={() => {
            setEditingStudent(viewingStudent);
            setViewingStudent(null);
            setIsFormOpen(true);
          }}
          onUpdate={async () => {
            loadStudents();
            // Update the viewing student with fresh data
            const updatedStudents = await getStudents();
            const updated = updatedStudents.find(
              (s) => s.id === viewingStudent.id
            );
            if (updated) {
              setViewingStudent(updated);
            }
          }}
        />
      )}

      <ConfirmModal
        isOpen={!!studentToDelete}
        onClose={() => setStudentToDelete(null)}
        onConfirm={handleDelete}
        title="Delete Student"
        message="Are you sure you want to delete this student? This action cannot be undone."
        confirmText="Delete Student"
      />
    </div>
  );
};
