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
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-xl shadow-2xl overflow-hidden print:shadow-none print:rounded-none print:max-w-none print:w-full print:bg-white transition-all duration-300">
        {/* Modal Controls (Hidden when printing) */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/5 print:hidden">
          <h2 className="text-sm font-bold text-slate-800 dark:text-white">
            Invoice Preview
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-primary/20"
            >
              <Download size={14} />
              <span className="text-xs font-bold">Download / Print</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Invoice Content */}
        <div
          className="p-6 sm:p-10 bg-white text-slate-900"
          id="invoice-content"
        >
          {/* Header */}
          <div className="flex justify-between items-start gap-4 border-b border-slate-100 pb-6 mb-6">
            <div>
              <h1 className="text-xl font-black text-primary tracking-tight mb-0.5 uppercase">
                BHAGWAT LIBRARY
              </h1>
              <p className="text-[10px] text-slate-500 font-bold italic uppercase tracking-wider">
                Ultimate Self Study Center
              </p>
              <div className="text-[10px] text-slate-400 mt-2 flex flex-col gap-0.5 max-w-[220px]">
                <p className="font-bold text-slate-600">
                  bhagwatlibrary0@gmail.com
                </p>
                <p className="leading-tight">
                  Thana Bihpur, Tedhi Bazar Kaseri Tola Rd, Indian Bank CSP ke
                  Upper Floor pr
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-slate-900 px-3 py-1 rounded mb-2 inline-block">
                <span className="text-white font-black text-sm tracking-widest uppercase">
                  INVOICE
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">
                Date: <span className="text-slate-900">{today}</span>
              </p>
              <p className="text-[10px] text-slate-400 mt-0.5 font-bold uppercase tracking-tighter">
                No:{" "}
                <span className="text-slate-900">
                  BL-{student.id?.slice(-6).toUpperCase()}
                </span>
              </p>
            </div>
          </div>

          {/* Student Info Bar */}
          <div className="grid grid-cols-2 gap-4 mb-6 bg-slate-50 p-4 rounded-lg border border-slate-100">
            <div>
              <p className="text-[9px] uppercase tracking-widest text-slate-400 font-black mb-1">
                Student
              </p>
              <h3 className="text-sm font-black text-slate-900 uppercase">
                {student.name}
              </h3>
              <p className="text-slate-500 text-[10px] font-bold mt-0.5">
                Contact: {student.phone}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] uppercase tracking-widest text-slate-400 font-black mb-1">
                Membership
              </p>
              <p className="text-slate-900 text-xs font-bold">
                Seat: {student.seatNumber || "N/A"}
              </p>
              <p className="text-primary text-[10px] font-bold mt-0.5">
                Batch:{" "}
                {Array.isArray(student.batch)
                  ? student.batch.join(", ")
                  : student.batch}
              </p>
            </div>
          </div>

          {/* Table */}
          <div className="mb-6">
            <table className="w-full text-left">
              <thead className="border-b-2 border-slate-900">
                <tr>
                  <th className="py-2 text-[10px] font-black text-slate-900 uppercase">
                    Description
                  </th>
                  <th className="py-2 text-[10px] font-black text-slate-900 uppercase text-right">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-3">
                    <p className="text-xs font-bold text-slate-900">
                      Monthly Membership Fee
                    </p>
                    <p className="text-[9px] text-slate-400 font-medium">
                      Validity: {student.validityFrom} - {student.validityTo}
                    </p>
                  </td>
                  <td className="py-3 text-right text-xs font-black text-slate-900">
                    ₹{student.totalAmount}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals Section */}
          <div className="flex flex-col items-end gap-1 mb-6">
            <div className="flex justify-between w-40 text-[11px] font-bold text-slate-500">
              <span>SUB TOTAL</span>
              <span>₹{student.totalAmount}</span>
            </div>
            <div className="flex justify-between w-40 text-[11px] font-bold text-success">
              <span>PAID</span>
              <span>₹{student.paidAmount}</span>
            </div>
            <div className="flex justify-between w-40 border-t-2 border-slate-900 pt-1 mt-1 font-black text-sm">
              <span className="text-slate-900">BALANCE</span>
              <span className={balance > 0 ? "text-danger" : "text-slate-900"}>
                ₹{balance}
              </span>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center border-t border-slate-100 pt-6">
            <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mb-4">
              Thank you for choosing Bhagwat Library
            </p>
            <div className="flex justify-between items-end opacity-60">
              <div className="text-left">
                <p className="text-[8px] text-slate-300 font-medium italic">
                  Computer Generated Document
                </p>
              </div>
              <div className="text-right border-t border-slate-200 pt-1 min-w-[100px]">
                <p className="text-[9px] font-black text-slate-900 uppercase">
                  Authorized
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          
          /* Hide everything first */
          body * {
            visibility: hidden !important;
          }

          /* Specifically show the invoice and its path */
          #invoice-content, 
          #invoice-content * {
            visibility: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          #invoice-content {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            padding: 20mm !important;
            margin: 0 !important;
            background: white !important;
            color: black !important;
            display: block !important;
            box-sizing: border-box !important;
            z-index: 9999 !important;
          }

          /* Ensure images and backgrounds work */
          img {
            max-width: 100% !important;
          }

          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
