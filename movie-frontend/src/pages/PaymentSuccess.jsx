import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

function PaymentSuccess() {
  const { theme } = useTheme();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const plan = searchParams.get("plan");
  const tranId = searchParams.get("tran_id");

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
      </div>

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