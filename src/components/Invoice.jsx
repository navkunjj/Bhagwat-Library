import React, { useState } from "react";
import { X, Printer, Download, Loader2 } from "lucide-react";
import html2pdf from "html2pdf.js";
import { clsx } from "clsx";
import { ConfirmModal } from "./ConfirmModal";

export const Invoice = ({ student, onClose }) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorInfo, setErrorInfo] = useState(null); // { title: '', message: '', variant: '' }
  if (!student) return null;

  const handleDownload = async () => {
    const element = document.getElementById("invoice-capture-area");
    if (!element) return;

    setIsDownloading(true);

    const originalStyle = element.getAttribute("style");
    const originalClassName = element.className;

    element.style.width = "210mm";
    element.style.minHeight = "297mm";
    element.style.maxWidth = "none";
    element.style.margin = "0";
    element.style.transform = "none";
    element.style.scale = "1";
    element.classList.remove("transform", "origin-center");

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
      setErrorInfo({
        title: "Download Failed",
        message: "Failed to generate PDF. Please try again.",
        variant: "danger",
      });
    } finally {
      element.setAttribute("style", originalStyle);
      element.className = originalClassName;
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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm print:bg-white print:p-0 print:static print:block overflow-hidden">
      {/* Modal Container */}
      <div className="relative bg-slate-50 dark:bg-slate-900 w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden sm:rounded-xl print:shadow-none print:rounded-none print:max-w-none print:w-full print:bg-white print:h-auto transition-colors duration-300">
        {/* Simple Navbar */}
        <div className="flex items-center justify-between px-6 py-4 border-b dark:border-white/10 bg-white dark:bg-slate-900 print:hidden transition-colors duration-300">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">
            Invoice Preview
          </h2>
          <div className="flex items-center gap-4">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="px-4 py-2 bg-slate-800 dark:bg-slate-700 hover:bg-slate-900 dark:hover:bg-slate-600 text-white rounded-lg flex items-center gap-2 transition-all disabled:opacity-50"
            >
              {isDownloading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Download size={18} />
              )}
              <span className="text-sm font-semibold">Download A4</span>
            </button>
            <button
              onClick={handlePrint}
              className="p-2 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors"
              title="Print"
            >
              <Printer size={20} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        {/* Scrollable Workspace */}
        <div className="flex-1 overflow-hidden bg-slate-200 dark:bg-slate-950 p-4 print:p-0 flex items-center justify-center transition-colors duration-300">
          <div className="max-h-full flex items-center justify-center">
            {/* Capture Area (A4) */}
            <div
              id="invoice-capture-area"
              className="bg-white text-slate-900 print:w-full border shadow-sm print:border-none rounded-none overflow-hidden origin-center transform"
              style={{
                width: "210mm",
                height: "297mm",
                minHeight: "297mm",
                boxSizing: "border-box",
                scale: "var(--invoice-scale, 0.5)",
              }}
            >
              {/* Document Inner */}
              <div className="p-[20mm] flex flex-col h-full font-serif border-[1px] border-slate-100 m-[5mm]">
                {/* Header */}
                <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-10">
                  <div className="flex gap-6 items-start">
                    <img
                      src="/logo.jpg"
                      alt="Logo"
                      className="w-20 h-20 object-cover border border-slate-200"
                      onError={(e) => {
                        e.target.src = "/logo.jpeg";
                        e.target.onError = null;
                      }}
                    />
                    <div>
                      <h1 className="text-4xl font-bold uppercase tracking-wider mb-2">
                        Bhagwat Library
                      </h1>
                      <p className="text-sm text-slate-600">
                        Thana Bihpur, Near Indian Bank, Bhagalpur
                      </p>
                      <p className="text-sm text-slate-600">
                        Phone: +91 82718 10760
                      </p>
                      <p className="text-sm text-slate-600 font-bold">
                        GSTIN/ID: BL-45892
                      </p>
                    </div>
                  </div>
                  <div className="text-right pt-2">
                    <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
                      FEE RECEIPT
                    </h2>
                    <p className="text-sm text-slate-500 mt-2">Date: {today}</p>
                    <p className="text-sm font-bold mt-1">
                      Receipt No: #INV-{student.id?.slice(-5).toUpperCase()}
                    </p>
                  </div>
                </div>

                {/* Main Content */}
                <div className="space-y-10">
                  {/* Student Section */}
                  <div className="grid grid-cols-2 gap-10">
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold border-b border-slate-200 pb-1">
                        STUDENT DETAILS
                      </h3>
                      <div className="space-y-2">
                        <p className="text-lg font-bold uppercase">
                          {student.name}
                        </p>
                        <p className="text-sm leading-relaxed">
                          {student.address || "Address not provided"}
                        </p>
                        <p className="text-sm">Contact: +91 {student.phone}</p>
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold border-b border-slate-200 pb-1">
                        SUBSCRIPTION INFO
                      </h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold">Batch Timing:</span>
                          <span className="uppercase">
                            {Array.isArray(student.batch)
                              ? student.batch.join(", ")
                              : student.batch}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold">Seat Number:</span>
                          <span>{student.seatNumber || "N/A"}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="font-semibold">Admission Date:</span>
                          <span>{student.admissionDate}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Validity Box */}
                  <div className="bg-slate-50 border border-slate-200 p-6 flex justify-around">
                    <div className="text-center">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                        Validity From
                      </p>
                      <p className="text-md font-bold">
                        {student.validityFrom || "--"}
                      </p>
                    </div>
                    <div className="w-px h-10 bg-slate-200 self-center" />
                    <div className="text-center">
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1">
                        Validity To
                      </p>
                      <p className="text-md font-bold text-red-600">
                        {student.validityTo || "--"}
                      </p>
                    </div>
                  </div>

                  {/* Payment Table */}
                  <div className="border border-slate-800 overflow-hidden">
                    <div className="grid grid-cols-12 bg-slate-100 border-b border-slate-800 px-4 py-2 font-bold text-sm">
                      <div className="col-span-8 uppercase text-xs">
                        Batch Timing / Particulars
                      </div>
                      <div className="col-span-4 text-right uppercase text-xs">
                        Amount to Pay
                      </div>
                    </div>
                    {/* Particulars Row - Fixed Stable Height */}
                    <div className="grid grid-cols-12 px-4 border-b border-slate-100 min-h-[100px] items-center">
                      <div className="col-span-8 py-4">
                        <p
                          className={clsx(
                            "font-bold uppercase tracking-tight",
                            (Array.isArray(student.batch)
                              ? student.batch.join(", ")
                              : student.batch || ""
                            ).length > 60
                              ? "text-xs"
                              : (Array.isArray(student.batch)
                                  ? student.batch.join(", ")
                                  : student.batch || ""
                                ).length > 30
                              ? "text-sm"
                              : "text-lg"
                          )}
                        >
                          {Array.isArray(student.batch)
                            ? student.batch.join(", ")
                            : student.batch}
                        </p>
                      </div>
                      <div className="col-span-4 text-right py-4">
                        <span className="font-bold text-2xl font-mono whitespace-nowrap">
                          ₹{student.totalAmount}.00
                        </span>
                      </div>
                    </div>

                    {/* Summary Lines */}
                    <div className="bg-slate-50 px-6 py-6 border-t border-slate-200">
                      <div className="flex justify-between items-center text-sm">
                        <span className="uppercase font-bold text-slate-500">
                          Total Amount Paid
                        </span>
                        <span className="font-black text-2xl font-mono text-green-600">
                          ₹{student.paidAmount}.00
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Note */}
                  <div className="text-[10px] text-slate-400 italic mt-10">
                    * This is a computer-generated receipt and does not require
                    a physical signature. Please retain this document for your
                    records. Fees once paid are non-refundable.
                  </div>
                </div>

                {/* Footer */}
                <div className="mt-auto flex justify-between items-end border-t-2 border-slate-900 pt-8">
                  <div className="text-center">
                    <div
                      className={`h-20 w-40 flex items-center justify-center uppercase font-black text-5xl select-none border-2 border-dashed transition-all ${
                        balance === 0
                          ? "border-green-500 text-green-500 -rotate-12 bg-green-50/50"
                          : "border-red-200 text-red-200 opacity-20"
                      }`}
                    >
                      {balance === 0 ? "PAID" : "DUE"}
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-2">
                      Document Status
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="h-16 w-56 border-b-2 border-slate-900 mb-2" />
                    <p className="text-xs font-bold uppercase tracking-wider">
                      Authorized Signatory
                    </p>
                    <p className="text-[10px] text-slate-500 uppercase mt-1">
                      Bhagwat Library Management
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        :root {
          --invoice-scale: 0.7;
        }

        @media (max-width: 640px) { :root { --invoice-scale: 0.32; } }
        @media (min-width: 641px) and (max-width: 768px) { :root { --invoice-scale: 0.45; } }
        @media (min-width: 769px) and (max-width: 1024px) { :root { --invoice-scale: 0.58; } }
        @media (min-width: 1025px) { :root { --invoice-scale: 0.7; } }
        
        @media (max-height: 900px) { :root { --invoice-scale: 0.65; } }
        @media (max-height: 800px) { :root { --invoice-scale: 0.58; } }
        @media (max-height: 700px) { :root { --invoice-scale: 0.51; } }

        @media print {
          @page {
            size: A4;
            margin: 0 !important;
          }
          body * {
            visibility: hidden !important;
          }
          #invoice-capture-area, #invoice-capture-area * {
            visibility: visible !important;
          }
          #invoice-capture-area {
            position: fixed !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            height: 297mm !important;
            margin: 0 !important;
            background: white !important;
            z-index: 9999 !important;
            box-shadow: none !important;
            transform: none !important;
            border: none !important;
          }
        }
      `}</style>

      <ConfirmModal
        isOpen={!!errorInfo}
        onClose={() => setErrorInfo(null)}
        onConfirm={() => setErrorInfo(null)}
        title={errorInfo?.title}
        message={errorInfo?.message}
        variant={errorInfo?.variant || "danger"}
        confirmText="Got it"
        showCancel={false}
      />
    </div>
  );
};
