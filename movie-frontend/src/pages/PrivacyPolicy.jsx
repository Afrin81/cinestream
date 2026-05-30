import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function PrivacyPolicy() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. Information We Collect",
      content: "We collect information you provide directly to us, such as your name, email address, and payment information when you register for an account or subscribe to our premium service. We also collect information about how you use our service, including the movies you watch and your preferences.",
    },
    {
      title: "2. How We Use Your Information",
      content: "We use the information we collect to provide, maintain, and improve our services, process transactions, send you technical notices and support messages, and personalize your experience on CineStream.",
    },
    {
      title: "3. Information Sharing",
      content: "We do not sell, trade, or otherwise transfer your personal information to third parties without your consent, except as described in this policy. We may share your information with trusted service providers who assist us in operating our platform.",
    },
    {
      title: "4. Data Security",
      content: "We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. Your data is encrypted and stored securely on our servers.",
    },
    {
      title: "5. Cookies",
      content: "We use cookies and similar tracking technologies to track activity on our platform and hold certain information. You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent.",
    },
    {
      title: "6. Your Rights",
      content: "You have the right to access, update, or delete your personal information at any time. You may also opt out of receiving promotional communications from us by following the unsubscribe instructions in those messages.",
    },
    {
      title: "7. Contact Us",
      content: "If you have any questions about this Privacy Policy, please contact us at support@cinestream.com or write to us at Dhaka, Bangladesh.",
    },
  ];

  return (
    <div style={{ background: theme.bg, minHeight: "100vh", paddingTop: "90px", paddingBottom: "60px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px" }}>

        {/* Header */}
        <div style={{ marginBottom: "40px" }}>
          <button
            onClick={() => navigate(-1)}
            style={{ background: "transparent", border: "none", color: "#dc2626", fontWeight: 700, fontSize: "14px", cursor: "pointer", marginBottom: "16px", padding: 0, display: "flex", alignItems: "center", gap: "6px" }}
          >
            ← Back
          </button>
          <h1 style={{ fontSize: "36px", fontWeight: 900, color: theme.textMain, margin: "0 0 8px" }}>
            Privacy Policy
          </h1>
          <p style={{ color: theme.textSub, fontSize: "14px", margin: 0 }}>
            Last updated: January 1, 2025
          </p>
        </div>

        {/* Intro */}
        <div style={{ background: theme.bgCard, border: "1px solid " + theme.border, borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
          <p style={{ color: theme.textSub, fontSize: "15px", lineHeight: 1.8, margin: 0 }}>
            Welcome to CineStream. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, and share information about you when you use our services.
          </p>
        </div>

        {/* Sections */}
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

export default PrivacyPolicy;