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
import { Loader } from "../components/Loader";

export const PaymentList = () => {
  const [students, setStudents] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterStatus, setFilterStatus] = React.useState("All"); // All, Paid, Unpaid
  const [editingStudent, setEditingStudent] = React.useState(null);
  const [isFormOpen, setIsFormOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(true);

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

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-white/5 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-primary/20 rounded-xl text-primary">
            <Users size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Total Students</p>
            <h3 className="text-2xl font-bold text-white">{totalStudents}</h3>
          </div>
        </div>
        <div className="bg-card border border-white/5 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-success/20 rounded-xl text-success">
            <Receipt size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Paid Students</p>
            <h3 className="text-2xl font-bold text-white">{paidStudents}</h3>
          </div>
        </div>
        <div className="bg-card border border-white/5 p-6 rounded-2xl flex items-center gap-4">
          <div className="p-3 bg-danger/20 rounded-xl text-danger">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="text-gray-400 text-sm font-medium">Unpaid Students</p>
            <h3 className="text-2xl font-bold text-white">{unpaidStudents}</h3>
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
            className="w-full bg-card border border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-gray-600"
          />
        </div>
        <div className="flex items-center gap-3">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-card border border-white/5 text-white rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50 cursor-pointer appearance-none"
          >
            <option value="All">All Status</option>
            <option value="Paid">Paid</option>
            <option value="Unpaid">Unpaid</option>
          </select>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-card border border-white/5 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-medium">Student</th>
                <th className="px-6 py-4 font-medium">Batch</th>
                <th className="px-6 py-4 font-medium">Validity</th>
                <th className="px-6 py-4 font-medium">Total Fee</th>
                <th className="px-6 py-4 font-medium">Paid</th>
                <th className="px-6 py-4 font-medium">Balance</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
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
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden flex-shrink-0 flex items-center justify-center border border-white/10">
                          {student.photo ? (
                            <img
                              src={student.photo}
                              alt={student.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Users size={14} className="text-gray-400" />
                          )}
                        </div>
                        <span className="font-medium text-white">
                          {student.name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {Array.isArray(student.batch)
                        ? student.batch.join(", ")
                        : student.batch}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-400">
                      {calculateValidity(student.admissionDate)}
                    </td>
                    <td className="px-6 py-4 text-sm text-white font-medium">
                      ₹{student.totalAmount || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-success">
                      ₹{student.paidAmount || 0}
                    </td>
                    <td className="px-6 py-4 text-sm text-danger">
                      ₹{balance}
                    </td>
                    <td className="px-6 py-4">
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
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => {
                          setEditingStudent(student);
                          setIsFormOpen(true);
                        }}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="Edit Payment"
                      >
                        <Edit2 size={16} />
                      </button>
                      {status === "Unpaid" && balance > 0 && (
                        <button
                          onClick={() => {
                            alert(
                              `Notification sent to ${student.name} for pending due: ₹${balance}`
                            );
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
    </div>
  );
};
