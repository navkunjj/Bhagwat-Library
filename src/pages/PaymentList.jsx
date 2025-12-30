import React from "react";
import {
  Search,
  Users,
  Receipt,
  AlertCircle,
  Edit2,
  Bell,
  Check,
  XCircle,
} from "lucide-react";
import {
  getStudents,
  calculateValidity,
  updateStudentPayment,
} from "../utils/store";
import { clsx } from "clsx";
import { StudentForm } from "../components/StudentForm";
import { StudentProfile } from "../components/StudentProfile";
import { Loader } from "../components/Loader";
import { ConfirmModal } from "../components/ConfirmModal";

export const PaymentList = () => {
  const [students, setStudents] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("All"); // All, Paid, Unpaid
  const [editingStudent, setEditingStudent] = React.useState(null);
  const [viewingStudent, setViewingStudent] = React.useState(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);
  const [notificationSent, setNotificationSent] = React.useState(null); // { name: '', amount: 0 }

  const loadStudents = async () => {
    setStudents(await getStudents());
    setLoading(false);
  };

  React.useEffect(() => {
    loadStudents();
  }, []);

  // Calculate stats
  const totalStudents = students.length;
  const paidStudents = students.filter((s) => {
    const status =
      s.status ||
      (s.paidAmount >= s.totalAmount && s.totalAmount > 0 ? "Paid" : "Unpaid");
    return status === "Paid";
  }).length;
  const unpaidStudents = totalStudents - paidStudents;

  const filteredStudents = students.filter((student) => {
    const matchesSearch = student.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    // Robust status check
    const studentStatus =
      student.status ||
      (student.paidAmount >= student.totalAmount && student.totalAmount > 0
        ? "Paid"
        : "Unpaid");
    const matchesFilter =
      filterStatus === "All" || studentStatus === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) return <Loader />;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-card border border-slate-200 dark:border-white/5 p-6 rounded-2xl flex items-center gap-4 shadow-sm dark:shadow-none transition-all duration-300">
          <div className="p-3 bg-primary/10 dark:bg-primary/20 rounded-xl text-primary">
            <Users size={24} />
          </div>
          <div>
            <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">
              Total Students
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {totalStudents}
            </h3>
          </div>
        </div>
        <div className="bg-white dark:bg-card border border-slate-200 dark:border-white/5 p-6 rounded-2xl flex items-center gap-4 shadow-sm dark:shadow-none transition-all duration-300">
          <div className="p-3 bg-success/10 dark:bg-success/20 rounded-xl text-success">
            <Receipt size={24} />
          </div>
          <div>
            <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">
              Paid Students
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {paidStudents}
            </h3>
          </div>
        </div>
        <div className="bg-white dark:bg-card border border-slate-200 dark:border-white/5 p-6 rounded-2xl flex items-center gap-4 shadow-sm dark:shadow-none transition-all duration-300">
          <div className="p-3 bg-danger/10 dark:bg-danger/20 rounded-xl text-danger">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-slate-500 dark:text-gray-400 text-sm font-medium">
              Unpaid Students
            </p>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              {unpaidStudents}
            </h3>
          </div>
        </div>
      </div>

      {/* Header & Filters */}
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
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white dark:bg-card border border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-none transition-all duration-300">
        <div className="overflow-x-auto custom-scrollbar max-h-[calc(100vh-330px)] overflow-y-auto">
          <table className="w-full text-left">
            <thead
              className=" text-slate-500 dark:text-gray-400 text-xs uppercase tracking-wider sticky top-0 z-10"
              style={{ backdropFilter: "blur(10px)" }}
            >
              <tr>
                <th className="px-3 py-3 md:px-6 md:py-4 font-medium whitespace-nowrap">
                  Student
                </th>
                <th className="px-3 py-3 md:px-6 md:py-4 font-medium">Batch</th>
                <th className="px-3 py-3 md:px-6 md:py-4 font-medium">
                  Validity
                </th>
                <th className="px-3 py-3 md:px-6 md:py-4 font-medium">
                  Total Fee
                </th>
                <th className="px-3 py-3 md:px-6 md:py-4 font-medium">Paid</th>
                <th className="px-3 py-3 md:px-6 md:py-4 font-medium">
                  Balance
                </th>
                <th className="px-3 py-3 md:px-6 md:py-4 font-medium">
                  Status
                </th>
                <th className="px-3 py-3 md:px-6 md:py-4 font-medium text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-white/5">
              {filteredStudents.map((student) => {
                const status =
                  student.status ||
                  (student.paidAmount >= student.totalAmount &&
                  student.totalAmount > 0
                    ? "Paid"
                    : "Unpaid");
                const balance = Math.max(
                  0,
                  (student.totalAmount || 0) - (student.paidAmount || 0)
                );

                return (
                  <tr
                    key={student.id}
                    className="hover:bg-white/5 transition-colors group"
                  >
                    <td className="px-3 py-3 md:px-6 md:py-4">
                      <div
                        onClick={() => setViewingStudent(student)}
                        className="flex items-center gap-2 md:gap-3 cursor-pointer group/profile"
                      >
                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center border border-slate-200 dark:border-white/10 group-hover/profile:border-primary/50 transition-colors">
                          {student.photo ? (
                            <img
                              src={student.photo}
                              alt={student.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Users
                              size={14}
                              className="text-slate-400 dark:text-gray-400 group-hover/profile:text-primary transition-colors"
                            />
                          )}
                        </div>
                        <span className="font-medium text-slate-900 dark:text-white group-hover/profile:text-primary transition-colors whitespace-nowrap text-sm md:text-base">
                          {student.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-slate-500 dark:text-gray-400">
                      <div
                        className="max-w-[150px] truncate"
                        title={
                          Array.isArray(student.batch)
                            ? student.batch.join(", ")
                            : student.batch
                        }
                      >
                        {Array.isArray(student.batch)
                          ? student.batch.join(", ")
                          : student.batch}
                      </div>
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-slate-500 dark:text-gray-400">
                      {student.validityFrom && student.validityTo ? (
                        <div className="flex flex-col text-xs">
                          <span>{student.validityFrom}</span>
                          <span className="text-slate-300">to</span>
                          <span>{student.validityTo}</span>
                        </div>
                      ) : (
                        <span className="text-slate-400 italic text-xs">
                          Not set
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-slate-900 dark:text-white font-medium">
                      ₹{student.totalAmount || 0}
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-success">
                      ₹{student.paidAmount || 0}
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-sm text-danger">
                      ₹{balance}
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4">
                      <span
                        className={clsx(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                          status === "Paid"
                            ? "bg-success/10 text-success border-success/20"
                            : "bg-danger/10 text-danger border-danger/20"
                        )}
                      >
                        {status}
                      </span>
                    </td>
                    <td className="px-3 py-3 md:px-6 md:py-4 text-right">
                      <button
                        onClick={() => {
                          setEditingStudent(student);
                          setIsFormOpen(true);
                        }}
                        className="p-2 text-slate-400 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
                        title="Edit Payment"
                      >
                        <Edit2 size={16} />
                      </button>
                      {status === "Unpaid" && balance > 0 && (
                        <button
                          onClick={() => {
                            setNotificationSent({
                              name: student.name,
                              amount: balance,
                            });
                          }}
                          className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-lg transition-colors"
                          title="Send Notification"
                        >
                          <Bell size={16} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filteredStudents.length === 0 && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-gray-500"
                  >
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Search size={32} className="opacity-20" />
                      <p>No records found.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reuse Form for Editing (since it handles payments too) */}
      {isFormOpen && (
        <StudentForm
          student={editingStudent}
          mode="payment"
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
        isOpen={!!notificationSent}
        onClose={() => setNotificationSent(null)}
        title="Notification Sent"
        message={`Success! A notification has been sent to ${notificationSent?.name} regarding their pending balance of ₹${notificationSent?.amount}.`}
        confirmText="Got it"
        variant="success"
        showCancel={false}
      />
    </div>
  );
};
