import React from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

function CookiePolicy() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. What Are Cookies",
      content: "Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and to provide information to the website owners.",
    },
    {
      title: "2. How We Use Cookies",
      content: "CineStream uses cookies to remember your login status, preferences, and settings. We also use cookies to understand how you interact with our platform and to improve your experience.",
    },
    {
      title: "3. Types of Cookies We Use",
      content: "We use essential cookies that are necessary for the platform to function, performance cookies that help us understand how visitors use our site, and preference cookies that remember your settings and preferences.",
    },
    {
      title: "4. Essential Cookies",
      content: "These cookies are necessary for the website to function and cannot be switched off. They are usually set in response to actions you take such as logging in or setting your preferences.",
    },
    {
      title: "5. Analytics Cookies",
      content: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us know which pages are most popular and how visitors navigate the platform.",
    },
    {
      title: "6. Managing Cookies",
      content: "You can control and manage cookies in your browser settings. Please note that removing or blocking cookies may impact your user experience and some features of our service may not function properly.",
    },
    {
      title: "7. Contact Us",
      content: "If you have questions about our use of cookies, please contact us at support@cinestream.com.",
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
            Cookie Policy
          </h1>
          <p style={{ color: theme.textSub, fontSize: "14px", margin: 0 }}>
            Last updated: January 1, 2025
          </p>
        </div>

        <div style={{ background: theme.bgCard, border: "1px solid " + theme.border, borderRadius: "16px", padding: "24px", marginBottom: "24px" }}>
          <p style={{ color: theme.textSub, fontSize: "15px", lineHeight: 1.8, margin: 0 }}>
            This Cookie Policy explains how CineStream uses cookies and similar technologies to recognize you when you visit our platform.
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

export default CookiePolicy;