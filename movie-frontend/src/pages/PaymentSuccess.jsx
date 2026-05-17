import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

function PaymentSuccess() {
  const { theme } = useTheme();
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const plan = searchParams.get("plan");
  const tranId = searchParams.get("tran_id");
  const amount = plan === "monthly" ? "199" : "1499";
  const planName = plan === "monthly" ? "Monthly Premium" : "Yearly Premium";
  const date = new Date().toLocaleDateString("en-GB", {
    day: "2-digit", month: "long", year: "numeric"
  });

  useEffect(() => {
    // ✅ Refresh user data to get updated isPremium
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (currentUser?.token) {
      fetch("https://cinestream-backend-ng16.onrender.com/api/auth/me", {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      })
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            const updatedUser = { ...currentUser, ...data.user };
            localStorage.setItem("currentUser", JSON.stringify(updatedUser));
            login(updatedUser);
          }
        })
        .catch(err => console.log(err));
    }
  }, []);

  // ✅ Download Invoice as HTML (prints as PDF)
  const handleDownloadInvoice = () => {
    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice - CineStream</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: Arial, sans-serif; background: #fff; color: #111; padding: 40px; }
          .invoice { max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; }
          .header { background: #dc2626; color: white; padding: 32px; text-align: center; }
          .header h1 { font-size: 28px; font-weight: 900; margin-bottom: 4px; }
          .header p { font-size: 14px; opacity: 0.85; }
          .body { padding: 32px; }
          .title { font-size: 22px; font-weight: 800; margin-bottom: 24px; color: #111; }
          .row { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #f3f4f6; font-size: 15px; }
          .row:last-child { border-bottom: none; }
          .label { color: #6b7280; }
          .value { font-weight: 700; color: #111; }
          .total-row { display: flex; justify-content: space-between; padding: 16px; background: #fef2f2; border-radius: 8px; margin-top: 16px; }
          .total-label { font-size: 16px; font-weight: 700; color: #dc2626; }
          .total-value { font-size: 20px; font-weight: 900; color: #dc2626; }
          .status { text-align: center; margin-top: 24px; background: #dcfce7; border: 1px solid #86efac; border-radius: 8px; padding: 12px; color: #166534; font-weight: 700; font-size: 15px; }
          .footer { text-align: center; padding: 24px; background: #f9fafb; color: #6b7280; font-size: 13px; }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <h1>🎬 CineStream</h1>
            <p>Your ultimate movie streaming platform</p>
          </div>
          <div class="body">
            <p class="title">Payment Invoice</p>
            <div class="row">
              <span class="label">Invoice Date</span>
              <span class="value">${date}</span>
            </div>
            <div class="row">
              <span class="label">Transaction ID</span>
              <span class="value">${tranId}</span>
            </div>
            <div class="row">
              <span class="label">Customer Name</span>
              <span class="value">${user?.name || "Customer"}</span>
            </div>
            <div class="row">
              <span class="label">Customer Email</span>
              <span class="value">${user?.email || ""}</span>
            </div>
            <div class="row">
              <span class="label">Plan</span>
              <span class="value">💎 ${planName}</span>
            </div>
            <div class="row">
              <span class="label">Payment Method</span>
              <span class="value">SSLCommerz</span>
            </div>
            <div class="row">
              <span class="label">Currency</span>
              <span class="value">BDT (Bangladeshi Taka)</span>
            </div>
            <div class="total-row">
              <span class="total-label">Total Paid</span>
              <span class="total-value">৳${amount}</span>
            </div>
            <div class="status">✅ Payment Successful</div>
          </div>
          <div class="footer">
            <p>Thank you for subscribing to CineStream Premium!</p>
            <p style="margin-top:6px">For support, contact: support@cinestream.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([invoiceHTML], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const printWindow = window.open(url, "_blank");
    printWindow.onload = () => {
      printWindow.print();
      URL.revokeObjectURL(url);
    };
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: theme.bg,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
      gap: "20px",
      padding: "24px",
      textAlign: "center",
    }}>
      <div style={{ fontSize: "72px" }}>🎉</div>

      <h1 style={{ color: theme.textMain, fontSize: "32px", fontWeight: 900, margin: 0 }}>
        Payment Successful!
      </h1>

      <p style={{ color: theme.textSub, fontSize: "16px", margin: 0, maxWidth: "400px" }}>
        Welcome to Premium! You now have access to all premium movies.
      </p>

      <div style={{
        background: theme.bgCard,
        border: "1px solid #22c55e",
        borderRadius: "16px",
        padding: "24px 32px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        minWidth: "300px",
      }}>
        <p style={{ color: theme.textSub, fontSize: "13px", margin: 0 }}>Plan Activated</p>
        <p style={{ color: theme.textMain, fontSize: "20px", fontWeight: 800, margin: 0 }}>
          💎 {plan === "monthly" ? "Monthly Premium — ৳199/month" : "Yearly Premium — ৳1499/year"}
        </p>
        <p style={{ color: "#22c55e", fontSize: "14px", fontWeight: 700, margin: 0 }}>
          ✅ Transaction ID: {tranId}
        </p>
        <p style={{ color: theme.textSub, fontSize: "13px", margin: 0 }}>
          📅 {date}
        </p>
      </div>

      {/* ✅ Invoice Download Button */}
      <button
        onClick={handleDownloadInvoice}
        style={{
          background: "transparent",
          color: "#22c55e",
          border: "2px solid #22c55e",
          padding: "12px 32px",
          borderRadius: "12px",
          fontWeight: 700,
          fontSize: "15px",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          transition: "all 0.2s",
        }}
        onMouseEnter={(e) => { e.target.style.background = "#22c55e"; e.target.style.color = "white"; }}
        onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#22c55e"; }}
      >
        🧾 Download Invoice
      </button>

      <button
        onClick={() => navigate("/")}
        style={{
          background: "#dc2626",
          color: "white",
          border: "none",
          padding: "14px 40px",
          borderRadius: "12px",
          fontWeight: 700,
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        Start Watching 🎬
      </button>
    </div>
  );
}

export default PaymentSuccess;