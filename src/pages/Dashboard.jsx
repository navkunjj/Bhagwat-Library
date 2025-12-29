import React from "react";
import { Users, CreditCard, AlertCircle } from "lucide-react";
import { getStudents } from "../utils/store";
import { clsx } from "clsx";

const StatCard = ({ label, value, subtext, icon, color }) => {
  const Icon = icon;
  return (
    <div className="bg-card border border-white/5 rounded-2xl p-6 flex items-start justify-between hover:border-white/10 transition-colors group">
      <div>
        <p className="text-sm font-medium text-gray-400 mb-1">{label}</p>
        <h3 className="text-3xl font-bold text-white mb-1">{value}</h3>
        {subtext && (
          <p className={clsx("text-xs flex items-center gap-1", color)}>
            {subtext}
          </p>
        )}
      </div>
      <div
        className={clsx(
          "p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors",
          color
        )}
      >
        <Icon size={24} />
      </div>
    </div>
  );
};

export const Dashboard = ({ onTabChange }) => {
  const [stats, setStats] = React.useState({ total: 0, paid: 0, unpaid: 0 });
  const [recentStudents, setRecentStudents] = React.useState([]);

  React.useEffect(() => {
    const fetchStats = async () => {
      const students = await getStudents();
      const total = students.length;
      const paid = students.filter((s) => s.status === "Paid").length;
      const unpaid = students.filter((s) => s.status === "Unpaid").length;

      setStats({ total, paid, unpaid });
      setRecentStudents(students.slice(0, 5)); // Show top 5
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          label="Total Students"
          value={stats.total}
          subtext="+12% from last month"
          icon={Users}
          color="text-primary"
        />
        <StatCard
          label="Paid Students"
          value={stats.paid}
          subtext="Revenue secured"
          icon={CreditCard}
          color="text-success"
        />
        <StatCard
          label="Unpaid Dues"
          value={stats.unpaid}
          subtext="Action required"
          icon={AlertCircle}
          color="text-danger"
        />
      </div>

      {/* Recent Activity / Quick View */}
      <div className="bg-card border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="font-semibold text-lg">Recent Admitted Students</h3>
          <button
            onClick={() => onTabChange?.("students")}
            className="text-sm text-primary hover:text-primary/80 transition-colors"
          >
            View All
          </button>
        </div>
        <div className="overflow-x-auto custom-scrollbar max-h-[400px] overflow-y-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 text-xs uppercase tracking-wider sticky top-0">
              <tr>
                <th className="px-6 py-4 font-medium">Name</th>
                <th className="px-6 py-4 font-medium">Batch</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-white">
                    {student.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-400">
                    {student.batch}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={clsx(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
                        student.status === "Paid"
                          ? "bg-success/10 text-success border-success/20"
                          : "bg-danger/10 text-danger border-danger/20"
                      )}
                    >
                      {student.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recentStudents.length === 0 && (
                <tr>
                  <td
                    colSpan={3}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No students found. Add one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
