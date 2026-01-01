import React, { useState } from "react";
import {
  X,
  Printer,
  Download,
  Loader2,
  ShieldCheck,
  Bookmark,
} from "lucide-react";
import html2pdf from "html2pdf.js";

export const Invoice = ({ student, onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  if (!student) return null;

  const handleDownload = async () => {
    const element = document.getElementById("invoice-capture-area");
    if (!element) return;

    setIsDownloading(true);

    // Technical Adjustment: Force consistent width for high-fidelity capture
    const originalStyle = element.getAttribute("style");
    element.style.width = "210mm";
    element.style.maxWidth = "none";
    element.style.margin = "0";

    const opt = {
      margin: 0,
      filename: `Invoice_${student.name.replace(
        /\s+/g,
        "_"
      )}_${new Date().getTime()}.pdf`,
      image: { type: "jpeg", quality: 1.0 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        letterRendering: true,
        backgroundColor: "#ffffff",
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    try {
      await html2pdf().from(element).set(opt).save();
    } catch (error) {
      console.error("PDF generation failed:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      element.setAttribute("style", originalStyle);
      setIsDownloading(false);
    }
  };

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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300 print:bg-white print:p-0 print:static print:block overflow-hidden">
      {/* Modal / Preview Window */}
      <div className="relative bg-white dark:bg-slate-900 w-full max-w-5xl h-[95vh] sm:h-[92vh] rounded-3xl shadow-2xl flex flex-col transition-all duration-300 print:shadow-none print:rounded-none print:max-w-none print:w-full print:bg-white print:h-auto overflow-hidden mx-2 sm:mx-6">
        {/* Professional Navbar */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-slate-100 dark:border-white/5 bg-white dark:bg-slate-900 print:hidden z-20">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-lg shadow-slate-900/20">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white leading-none tracking-tight">
                Secure Invoice Receipt
              </h2>
              <p className="text-[11px] text-slate-500 font-bold mt-1.5 flex items-center gap-1.5 uppercase tracking-wider">
                Authorized Documentation{" "}
                <span className="w-1 h-1 rounded-full bg-slate-300"></span> ID:
                BL-{student.id?.slice(-6).toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl transition-all flex items-center gap-2.5 active:scale-95 shadow-xl shadow-primary/20 disabled:opacity-70 group"
            >
              {isDownloading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Download
                  size={18}
                  className="group-hover:translate-y-0.5 transition-transform"
                />
              )}
              <span className="text-xs font-black uppercase tracking-widest">
                {isDownloading ? "Generating..." : "Download A4 PDF"}
              </span>
            </button>

            <button
              onClick={handlePrint}
              className="p-2.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all"
              title="Print Receipt"
            >
              <Printer size={22} />
            </button>

            <div className="w-px h-8 bg-slate-200 dark:bg-white/10 mx-1" />

            <button
              onClick={onClose}
              className="p-2.5 text-slate-400 hover:text-danger hover:bg-danger/5 rounded-xl transition-all"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Workspace Area */}
        <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950/40 p-4 sm:p-8 md:p-12 print:p-0 custom-scrollbar-v2 flex flex-col items-center">
          {/* Digital Paper Design */}
          <div
            id="invoice-capture-area"
            className="bg-white text-slate-900 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] print:shadow-none print:w-full border border-slate-100 print:border-none rounded-sm overflow-hidden origin-top transform scale-[0.6] xs:scale-[0.7] sm:scale-[0.85] md:scale-[0.8] lg:scale-[0.75] transition-transform duration-500 mb-[-30%] xs:mb-[-20%] sm:mb-[-10%] md:mb-[-8%]"
            style={{
              width: "100%",
              maxWidth: "210mm",
              aspectRatio: "1 / 1.414",
              minHeight: "297mm",
              boxSizing: "border-box",
            }}
          >
            {/* The Document Layout */}
            <div className="p-[14mm] sm:p-[20mm] flex flex-col h-full min-h-[297mm] relative">
              {/* Document Background Accents (Printable) */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[4rem] -z-0" />

              {/* Header Section */}
              <div className="flex justify-between items-start mb-20 relative z-10">
                <div className="flex gap-8">
                  <div className="relative">
                    <img
                      src="/logo.jpg"
                      alt="Logo"
                      className="w-24 h-24 rounded-3xl object-cover shadow-2xl ring-8 ring-white"
                      onError={(e) => {
                        e.target.src = "/logo.jpeg";
                        e.target.onError = null;
                      }}
                    />
                    <div className="absolute -bottom-3 -right-3 w-10 h-10 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-lg">
                      <Bookmark size={16} />
                    </div>
                  </div>
                  <div className="pt-2">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tighter leading-none mb-2">
                      BHAGWAT<span className="text-primary italic">.</span>
                    </h1>
                    <p className="text-slate-500 text-xs font-black uppercase tracking-[0.3em] mb-6">
                      Study & Research Center
                    </p>
                    <div className="space-y-1.5">
                      <p className="text-[11px] text-slate-900 font-black flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        bhagwatlibrary0@gmail.com
                      </p>
                      <p className="text-[11px] text-slate-500 font-bold italic leading-relaxed max-w-[320px]">
                        Tedhi Bazar, Kaseri Tola Road, Thana Bihpur, Near Indian
                        Bank
                      </p>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-block px-4 py-1.5 bg-slate-100 rounded-lg text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 border border-slate-200">
                    Official Receipt
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                      Document ID
                    </p>
                    <p className="text-2xl font-black text-slate-900 tracking-tighter">
                      #BL-{student.id?.slice(-5).toUpperCase()}
                    </p>
                  </div>
                  <div className="mt-4 space-y-1">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-tighter text-right">
                      Issue Date
                    </p>
                    <p className="text-xs font-black text-slate-900">{today}</p>
                  </div>
                </div>
              </div>

              {/* Data Blocks */}
              <div className="grid grid-cols-12 gap-10 mb-20 relative z-10">
                <div className="col-span-12 h-px bg-gradient-to-r from-slate-200 via-slate-100 to-transparent mb-2" />

                {/* Account Details */}
                <div className="col-span-8">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-6">
                    Recipient Account
                  </p>
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-3xl font-black text-slate-900 uppercase leading-none tracking-tight mb-2">
                        {student.name}
                      </h3>
                      <div className="flex gap-4">
                        <span className="text-xs font-black text-slate-400 uppercase">
                          Contact
                        </span>
                        <span className="text-xs font-black text-slate-900 uppercase tracking-widest">
                          {student.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Logistics */}
                <div className="col-span-4 border-l-2 border-slate-100 pl-10 space-y-8">
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">
                      Workspace
                    </p>
                    <p className="text-3xl font-black text-slate-900 tracking-tighter">
                      Seat {student.seatNumber || "—"}
                    </p>
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2">
                      Session
                    </p>
                    <p className="text-sm font-black text-primary uppercase bg-primary/5 px-2 py-0.5 rounded-md w-fit italic">
                      {Array.isArray(student.batch)
                        ? student.batch.join(", ")
                        : student.batch}{" "}
                      Batch
                    </p>
                  </div>
                </div>
              </div>

              {/* Transaction Table */}
              <div className="flex-1 relative z-10">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-4 border-slate-900">
                      <th className="pb-6 text-[11px] font-black text-slate-900 uppercase text-left tracking-[0.2em] pl-4">
                        Description of Service
                      </th>
                      <th className="pb-6 text-[11px] font-black text-slate-900 uppercase text-right tracking-[0.2em] pr-4">
                        Total Amount
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="py-12 pl-4">
                        <div className="flex flex-col gap-2">
                          <span className="text-xl font-black text-slate-900 leading-none">
                            Standard Library Membership Subscription
                          </span>
                          <span className="text-xs font-bold text-slate-500 tracking-tight italic">
                            Full access granted for the validity period:{" "}
                            {student.validityFrom} to {student.validityTo}
                          </span>
                        </div>
                      </td>
                      <td className="py-12 pr-4 text-right">
                        <span className="text-2xl font-black font-mono text-slate-900 tracking-tighter">
                          ₹{student.totalAmount}.00
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Grand Totals */}
              <div className="flex justify-end pt-12 relative z-10">
                <div className="w-80 space-y-6">
                  <div className="flex justify-between items-center px-4">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                      Base Subscription
                    </span>
                    <span className="font-bold text-slate-600 font-mono">
                      ₹{student.totalAmount}
                    </span>
                  </div>
                  <div className="flex justify-between items-center px-4">
                    <span className="text-[11px] font-black text-success uppercase tracking-widest leading-none bg-success/5 px-2 py-1 rounded">
                      Amount Deposited
                    </span>
                    <span className="font-black text-success font-mono text-lg underline underline-offset-4 decoration-success/30 italic">
                      ₹{student.paidAmount}
                    </span>
                  </div>

                  <div className="pt-8 px-6 py-7 bg-slate-900 rounded-[2.5rem] shadow-2xl relative overflow-hidden ring-4 ring-slate-100">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-12 -mt-12 rounded-full rotate-45" />
                    <div className="flex justify-between items-center relative z-10">
                      <div className="space-y-1">
                        <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.4em]">
                          Balance Outstanding
                        </p>
                        <h2
                          className={`text-4xl font-black font-mono leading-none tracking-tighter ${
                            balance > 0 ? "text-white" : "text-success"
                          }`}
                        >
                          ₹{balance}
                        </h2>
                      </div>
                      <div
                        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                          balance > 0
                            ? "bg-white/10 text-white"
                            : "bg-success/20 text-success"
                        }`}
                      >
                        {balance > 0 ? (
                          <Loader2 size={24} />
                        ) : (
                          <ShieldCheck size={24} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Authentication Footer */}
              <div className="mt-auto pt-20 border-t-2 border-slate-100 flex justify-between items-end relative z-10">
                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <p className="text-[10px] text-slate-900 font-black uppercase tracking-widest">
                      Validation Notice
                    </p>
                    <p className="text-[9px] text-slate-400 font-bold italic leading-relaxed max-w-xs">
                      * This document represents an official transaction record
                      within the Bhagwat Library network. Not valid for external
                      verification unless stamped by the registrar.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-2 bg-slate-50 border border-slate-200 rounded-2xl w-fit">
                    <div className="w-2.5 h-2.5 rounded-full bg-success shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    <span className="text-[10px] font-black text-slate-800 uppercase tracking-[0.2em]">
                      Transaction Confirmed
                    </span>
                  </div>
                </div>

                <div className="text-right w-64 group cursor-default">
                  <div className="h-20 flex flex-col items-end justify-center mb-4">
                    <span className="font-['Italianno',cursive] text-5xl text-slate-300 opacity-60 group-hover:opacity-100 transition-all duration-500 -rotate-3 select-none translate-y-4">
                      Library Management
                    </span>
                    <div className="w-16 h-1 bg-primary/20 rounded-full mt-2 group-hover:w-32 transition-all duration-700" />
                  </div>
                  <div className="h-[4px] w-full bg-slate-900 rounded-full mb-3" />
                  <p className="text-sm font-black text-slate-900 uppercase tracking-[0.2em]">
                    Authorized Registrar
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.3em] mt-1.5">
                    Internal Audit Division
                  </p>
                </div>
              </div>

              {/* Visual Watermark (Preview Only) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5 sm:opacity-[0.03] select-none scale-150 -rotate-45 -z-10">
                <h1 className="text-[180px] font-black uppercase text-slate-900 tracking-tighter">
                  BHAGWAT
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Italianno&display=swap');

        .custom-scrollbar-v2::-webkit-scrollbar {
          width: 10px;
        }
        .custom-scrollbar-v2::-webkit-scrollbar-track {
          background: #f8fafc;
        }
        .custom-scrollbar-v2::-webkit-scrollbar-thumb {
          background: #e2e8f0;
          border-radius: 10px;
          border: 3px solid #f8fafc;
        }
        .custom-scrollbar-v2::-webkit-scrollbar-thumb:hover {
          background: #cbd5e1;
        }

        @media print {
          @page {
            size: A4;
            margin: 0 !important;
          }
          
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          body * {
            visibility: hidden !important;
          }

          #invoice-capture-area, 
          #invoice-capture-area * {
            visibility: visible !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          #invoice-capture-area {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            padding: 0 !important;
            margin: 0 !important;
            background: white !important;
            color: black !important;
            display: block !important;
            box-sizing: border-box !important;
            z-index: 9999 !important;
            box-shadow: none !important;
            transform: none !important;
            aspect-ratio: auto !important;
            border: none !important;
          }

          .print\\:hidden {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
