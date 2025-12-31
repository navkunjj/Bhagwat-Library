import React from "react";
import { X, Printer, Download, Share2 } from "lucide-react";

export const Invoice = ({ student, onClose }) => {
  if (!student) return null;

  const handlePrint = () => {
    window.print();
  };

  const balance = Math.max(0, student.totalAmount - student.paidAmount);
  const today = new Date().toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300 print:bg-white print:p-0 print:static print:block">
      <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none print:max-w-none print:w-full print:bg-white transition-all duration-300">
        {/* Modal Controls (Hidden when printing) */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 print:hidden">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-slate-800 dark:text-white">
              Payment Invoice
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-600 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors flex items-center gap-2"
              title="Print Invoice"
            >
              <Printer size={18} />
              <span className="text-sm font-medium hidden sm:inline">
                Print
              </span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div
          className="p-8 sm:p-12 bg-white text-slate-900"
          id="invoice-content"
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b-2 border-slate-100 pb-8 mb-8">
            <div>
              <h1 className="text-3xl font-black text-primary tracking-tight mb-1 uppercase">
                BHAGWAT LIBRARY
              </h1>
              <p className="text-slate-500 text-sm font-medium">
                Ultimate Self Study Center
              </p>
              <p className="text-slate-400 text-xs mt-2 max-w-[200px]">
                Sector 14, Opposite Main Gate, Near City Center, Jaipur,
                Rajasthan
              </p>
            </div>
            <div className="text-right">
              <div className="bg-primary/5 px-4 py-2 rounded-lg inline-block mb-2">
                <span className="text-primary font-bold text-xl tracking-wider">
                  INVOICE
                </span>
              </div>
              <p className="text-slate-400 text-xs">
                Date:{" "}
                <span className="text-slate-900 font-semibold">{today}</span>
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Invoice No:{" "}
                <span className="text-slate-900 font-semibold">
                  INV-{student.id?.slice(-6).toUpperCase()}
                </span>
              </p>
            </div>
          </div>

          {/* Student & Billing Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-10">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3">
                Bill To
              </p>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                {student.name}
              </h3>
              <p className="text-slate-500 text-sm mb-1">{student.phone}</p>
              <p className="text-slate-500 text-sm leading-relaxed">
                {student.address}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-3">
                Membership Details
              </p>
              <p className="text-slate-500 text-sm mb-1">
                Batch:{" "}
                <span className="text-slate-900 font-semibold">
                  {Array.isArray(student.batch)
                    ? student.batch.join(", ")
                    : student.batch}
                </span>
              </p>
              <p className="text-slate-500 text-sm mb-1">
                Admission:{" "}
                <span className="text-slate-900 font-semibold">
                  {student.admissionDate}
                </span>
              </p>
              <p className="text-slate-500 text-sm font-medium text-primary">
                Valid Until: {student.validityTo || "N/A"}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden mb-8">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 font-bold text-slate-700">
                    Description
                  </th>
                  <th className="px-6 py-4 font-bold text-slate-700 text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="px-6 py-4">
                    <p className="font-semibold text-slate-900">
                      Library Membership Fee
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Monthly subscription for library seat and facilities
                    </p>
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-slate-900">
                    ₹{student.totalAmount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-12">
            <div className="w-full sm:w-64 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Total Fee</span>
                <span className="font-semibold text-slate-900">
                  ₹{student.totalAmount}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Paid Amount</span>
                <span className="font-semibold text-success">
                  ₹{student.paidAmount}
                </span>
              </div>
              <div className="flex justify-between items-center border-t border-slate-200 pt-3">
                <span className="text-slate-900 font-bold">Balance Due</span>
                <span
                  className={`text-xl font-black ${
                    balance > 0 ? "text-danger" : "text-slate-400"
                  }`}
                >
                  ₹{balance}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-slate-100 pt-8 flex flex-col sm:flex-row justify-between items-center gap-6">
            <div className="text-center sm:text-left">
              <p className="text-xs text-slate-400 italic mb-2">
                Terms & Conditions:
              </p>
              <ul className="text-[10px] text-slate-400 list-disc list-inside space-y-1">
                <li>
                  This is a computer-generated invoice and doesn't require a
                  signature.
                </li>
                <li>Fees once paid are non-refundable and non-transferable.</li>
                <li>
                  Please maintain silence and discipline inside the library.
                </li>
              </ul>
            </div>
            <div className="text-center sm:text-right hidden sm:block">
              <div className="w-32 h-12 bg-slate-50 rounded border border-slate-100 flex items-center justify-center mb-2">
                <span className="text-[10px] uppercase tracking-widest text-slate-300 font-bold">
                  Authorized Seal
                </span>
              </div>
              <p className="text-xs font-bold text-slate-900 uppercase">
                Bhagwat Library
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #invoice-content, #invoice-content * {
            visibility: visible;
          }
          #invoice-content {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
