import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { FaCheck, FaTimes, FaCrown, FaLock } from "react-icons/fa";
import API from "../services/api.js";
import { updateCurrentUser } from "../services/authService.js";

function Payment() {
  const { theme } = useTheme();
  const { user, login } = useAuth();
  const navigate = useNavigate();

  const [selectedPlan, setSelectedPlan] = useState("monthly");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // 🔒 Not logged in
  if (!user) {
    return (
      <div style={{
        minHeight: "100vh", background: theme.bg,
        display: "flex", alignItems: "center",
        justifyContent: "center", flexDirection: "column",
        gap: "16px", paddingTop: "70px",
      }}>
        <p style={{ fontSize: "48px" }}>🔒</p>
        <h2 style={{ color: theme.textMain, fontSize: "24px", fontWeight: 800, margin: 0 }}>
          Login Required
        </h2>
        <p style={{ color: theme.textSub, fontSize: "15px", margin: 0 }}>
          Please login to upgrade to premium
        </p>
        <button
          onClick={() => navigate("/login")}
          style={{ background: "#dc2626", color: "white", border: "none", padding: "12px 32px", borderRadius: "12px", fontWeight: 700, fontSize: "16px", cursor: "pointer" }}
        >
          Login Now
        </button>
      </div>
    );
  }

  // ✅ Already premium
  if (user.isPremium) {
    return (
      <div style={{
        minHeight: "100vh", background: theme.bg,
        display: "flex", alignItems: "center",
        justifyContent: "center", flexDirection: "column",
        gap: "16px", paddingTop: "70px",
      }}>
        <p style={{ fontSize: "64px" }}>💎</p>
        <h2 style={{ color: theme.textMain, fontSize: "24px", fontWeight: 800, margin: 0 }}>
          You are already Premium!
        </h2>
        <p style={{ color: theme.textSub, fontSize: "15px", margin: 0 }}>
          Enjoy unlimited access to all movies
        </p>
        <button
          onClick={() => navigate("/")}
          style={{ background: "#dc2626", color: "white", border: "none", padding: "12px 32px", borderRadius: "12px", fontWeight: 700, fontSize: "16px", cursor: "pointer" }}
        >
          Browse Movies 🎬
        </button>
      </div>
    );
  }

  // 💳 Plans data
  const plans = [
    {
      id: "free",
      name: "Free",
      price: 0,
      period: "Forever",
      color: "#6b7280",
      features: [
        { text: "Watch free movies",  included: true },
        { text: "Watch trailers",     included: true },
        { text: "Add to watchlist",   included: true },
        { text: "Rate movies",        included: true },
        { text: "Premium movies",     included: false },
        { text: "HD Quality",         included: false },
        { text: "No ads",             included: false },
      ],
    },
    {
      id: "monthly",
      name: "Monthly",
      price: 199,
      period: "per month",
      color: "#dc2626",
      popular: true,
      features: [
        { text: "Watch free movies",  included: true },
        { text: "Watch trailers",     included: true },
        { text: "Add to watchlist",   included: true },
        { text: "Rate movies",        included: true },
        { text: "Premium movies",     included: true },
        { text: "HD Quality",         included: true },
        { text: "No ads",             included: true },
      ],
    },
    {
      id: "yearly",
      name: "Yearly",
      price: 1499,
      period: "per year",
      color: "#eab308",
      save: "Save 37%",
      features: [
        { text: "Watch free movies",  included: true },
        { text: "Watch trailers",     included: true },
        { text: "Add to watchlist",   included: true },
        { text: "Rate movies",        included: true },
        { text: "Premium movies",     included: true },
        { text: "HD Quality",         included: true },
        { text: "No ads",             included: true },
      ],
    },
  ];

  // 💳 Handle payment — connects to real backend
  const handlePayment = async () => {
    if (selectedPlan === "free") return;
    setLoading(true);
    setError("");

    try {
      // ✅ Call real backend API
      const response = await API.post("/payment/subscribe", {
        plan: selectedPlan,
      });

      if (response.data.success) {
        // ✅ Update user in localStorage and AuthContext
        const updatedUser = updateCurrentUser(response.data.user);
        login(updatedUser); // update AuthContext so isPremium is true immediately

        setSuccess(true);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Payment failed. Please try again.");
    }

    setLoading(false);
  };

  // ✅ Success screen
  if (success) {
    return (
      <div style={{
        minHeight: "100vh", background: theme.bg,
        display: "flex", alignItems: "center",
        justifyContent: "center", flexDirection: "column",
        gap: "20px",
        padding: "70px 24px 24px",
        textAlign: "center",
      }}>
        <div style={{ fontSize: "64px" }}>🎉</div>
        <h2 style={{ color: theme.textMain, fontSize: "28px", fontWeight: 900, margin: 0 }}>
          Welcome to Premium!
        </h2>
        <p style={{ color: theme.textSub, fontSize: "16px", margin: 0, maxWidth: "400px" }}>
          You now have access to all premium movies. Enjoy unlimited streaming!
        </p>
        <div style={{
          background: theme.bgCard,
          border: "1px solid " + theme.border,
          borderRadius: "16px",
          padding: "20px 32px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          minWidth: "280px",
        }}>
          <p style={{ color: theme.textSub, fontSize: "13px", margin: 0 }}>Plan activated</p>
          <p style={{ color: theme.textMain, fontSize: "18px", fontWeight: 800, margin: 0 }}>
            💎 {selectedPlan === "monthly" ? "Monthly Premium — ৳199/month" : "Yearly Premium — ৳1499/year"}
          </p>
          <p style={{ color: "#22c55e", fontSize: "13px", fontWeight: 600, margin: 0 }}>
            ✓ Payment Successful
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          style={{ background: "#dc2626", color: "white", border: "none", padding: "14px 40px", borderRadius: "12px", fontWeight: 700, fontSize: "16px", cursor: "pointer" }}
        >
          Start Watching 🎬
        </button>
      </div>
    );
  }

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", color: theme.textMain, paddingTop: "90px", paddingBottom: "60px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "#eab30822", border: "1px solid #eab308", borderRadius: "999px", padding: "6px 16px", marginBottom: "16px" }}>
            <FaCrown style={{ color: "#eab308" }} />
            <span style={{ color: "#eab308", fontSize: "13px", fontWeight: 700 }}>Upgrade to Premium</span>
          </div>
          <h1 style={{ fontSize: "36px", fontWeight: 900, color: theme.textMain, margin: "0 0 12px" }}>
            Choose Your Plan
          </h1>
          <p style={{ color: theme.textSub, fontSize: "16px", margin: 0 }}>
            Get unlimited access to all premium movies and features
          </p>
        </div>

        {/* Plans Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          marginBottom: "48px",
        }}>
          {plans.map((plan) => {
            const isSelected = selectedPlan === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                style={{
                  background: theme.bgCard,
                  border: "2px solid " + (isSelected ? plan.color : theme.border),
                  borderRadius: "20px",
                  padding: "32px 28px",
                  cursor: "pointer",
                  position: "relative",
                  transition: "all 0.2s ease",
                  transform: isSelected ? "scale(1.02)" : "scale(1)",
                  boxShadow: isSelected ? "0 12px 40px " + plan.color + "33" : "none",
                }}
              >
                {plan.popular && (
                  <div style={{ position: "absolute", top: "-12px", left: "50%", transform: "translateX(-50%)", background: "#dc2626", color: "white", fontSize: "12px", padding: "4px 16px", borderRadius: "999px", fontWeight: 700, whiteSpace: "nowrap" }}>
                    Most Popular
                  </div>
                )}
                {plan.save && (
                  <div style={{ position: "absolute", top: "-12px", right: "20px", background: "#eab308", color: "black", fontSize: "12px", padding: "4px 12px", borderRadius: "999px", fontWeight: 700 }}>
                    {plan.save}
                  </div>
                )}

                <h3 style={{ color: plan.color, fontWeight: 800, fontSize: "20px", margin: "0 0 8px" }}>
                  {plan.id === "free" ? "🆓" : "💎"} {plan.name}
                </h3>

                <div style={{ marginBottom: "24px" }}>
                  <span style={{ color: theme.textMain, fontSize: "36px", fontWeight: 900 }}>
                    {plan.price === 0 ? "Free" : "৳" + plan.price}
                  </span>
                  {plan.price > 0 && (
                    <span style={{ color: theme.textSub, fontSize: "14px", marginLeft: "6px" }}>
                      {plan.period}
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {plan.features.map((feature, index) => (
                    <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      {feature.included ? (
                        <FaCheck style={{ color: "#22c55e", fontSize: "13px", flexShrink: 0 }} />
                      ) : (
                        <FaTimes style={{ color: "#ef4444", fontSize: "13px", flexShrink: 0 }} />
                      )}
                      <span style={{ color: feature.included ? theme.textMain : theme.textSub, fontSize: "14px", textDecoration: feature.included ? "none" : "line-through" }}>
                        {feature.text}
                      </span>
                    </div>
                  ))}
                </div>

                {isSelected && (
                  <div style={{ marginTop: "20px", background: plan.color + "22", border: "1px solid " + plan.color, borderRadius: "8px", padding: "8px", textAlign: "center", color: plan.color, fontSize: "13px", fontWeight: 700 }}>
                    ✓ Selected
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Error message */}
        {error && (
          <div style={{ background: "#fee2e2", border: "1px solid #ef4444", color: "#dc2626", padding: "12px 20px", borderRadius: "10px", marginBottom: "16px", textAlign: "center", fontWeight: 600 }}>
            ❌ {error}
          </div>
        )}

        {/* Payment Button */}
        {selectedPlan !== "free" && (
          <div style={{ textAlign: "center" }}>
            <button
              onClick={handlePayment}
              disabled={loading}
              style={{
                background: loading ? "#9ca3af" : "#dc2626",
                color: "white",
                border: "none",
                padding: "16px 48px",
                borderRadius: "14px",
                fontWeight: 700,
                fontSize: "18px",
                cursor: loading ? "not-allowed" : "pointer",
                boxShadow: loading ? "none" : "0 8px 24px rgba(220,38,38,0.4)",
                transition: "all 0.2s",
                display: "block",
                margin: "0 auto 16px",
              }}
            >
              {loading ? "Processing Payment..." : "💳 Pay Now — ৳" + plans.find((p) => p.id === selectedPlan)?.price}
            </button>
            <p style={{ color: theme.textSub, fontSize: "13px", margin: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              <FaLock style={{ fontSize: "11px" }} />
              Secure payment • Cancel anytime
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

export default Payment;