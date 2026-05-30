import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function TermsOfService() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing and using CineStream, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our service.",
    },
    {
      title: "2. Use of Service",
      content: "CineStream grants you a limited, non-exclusive, non-transferable license to access and use our service for personal, non-commercial purposes. You may not reproduce, distribute, modify, or create derivative works of our content.",
    },
    {
      title: "3. User Accounts",
      content: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.",
    },
    {
      title: "4. Premium Subscription",
      content: "Premium subscriptions are billed on a monthly or yearly basis. Subscriptions automatically renew unless cancelled before the renewal date. Refunds are not provided for partial subscription periods.",
    },
    {
      title: "5. Content Policy",
      content: "All content on CineStream is protected by copyright and other intellectual property laws. You may not download, copy, or distribute any content from our platform without explicit written permission.",
    },
    {
      title: "6. Prohibited Activities",
      content: "You agree not to engage in any activity that interferes with or disrupts the service, attempt to gain unauthorized access to any portion of the service, or use the service for any unlawful purpose.",
    },
    {
      title: "7. Termination",
      content: "We reserve the right to terminate or suspend your account at any time for violations of these terms. Upon termination, your right to use the service will immediately cease.",
    },
    {
      title: "8. Contact Us",
      content: "If you have any questions about these Terms of Service, please contact us at support@cinestream.com.",
    },
  ];

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", paddingTop: "90px", paddingBottom: "60px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>

        <div style={{ marginBottom: "40px" }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: "transparent", border: "none", color: "#dc2626", fontWeight: 700, fontSize: "14px", cursor: "pointer", marginBottom: "16px", padding: 0 }}
          >
            ← Back
          </button>
          <h1 style={{ fontSize: "36px", fontWeight: 900, color: theme.textMain, margin: "0 0 8px" }}>
            Terms of Service
          </h1>
          <p style={{ color: theme.textSub, fontSize: "14px", margin: 0 }}>
            Last updated: January 1, 2025
          </p>
        </div>

        <div style={{ background: theme.bgCard, border: "1px solid " + theme.border, borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
          <p style={{ color: theme.textSub, fontSize: "15px", lineHeight: 1.8, margin: 0 }}>
            Please read these Terms of Service carefully before using CineStream. These terms govern your use of our platform and services.
          </p>
        </div>

        {sections.map((section, index) => (
          <div key={index} style={{ background: theme.bgCard, border: "1px solid " + theme.border, borderRadius: "16px", padding: "24px", marginBottom: "16px" }}>
            <h2 style={{ color: theme.textMain, fontWeight: 800, fontSize: "18px", margin: "0 0 12px" }}>
              {section.title}
            </h2>
            <p style={{ color: theme.textSub, fontSize: "15px", lineHeight: 1.8, margin: 0 }}>
              {section.content}
            </p>
          </div>
        ))}

      </div>
    </div>
  );
}

export default TermsOfService;