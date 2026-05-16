import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useTheme } from "./context/ThemeContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Home from "./pages/Home";
import Movies from "./pages/Movies";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MovieDetail from "./pages/MovieDetail";
import Watchlist from "./pages/Watchlist";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import Admin from "./pages/Admin";
import MoodPicker from "./components/MoodPicker";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";
import Dashboard from "./pages/Dashboard";

function App() {
  const { theme } = useTheme();

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div style={{ background: theme.bg, minHeight: "100vh", display: "flex", flexDirection: "column" }}>
        <Navbar />
        <div style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<><Hero /><MoodPicker /><Home /></>} />
            <Route path="/movies"           element={<Movies />} />
            <Route path="/login"            element={<Login />} />
            <Route path="/register"         element={<Register />} />
            <Route path="/movie/:id"        element={<MovieDetail />} />
            <Route path="/watchlist"        element={<Watchlist />} />
            <Route path="/payment"          element={<Payment />} />
            <Route path="/payment/success"  element={<PaymentSuccess />} />
            <Route path="/admin"            element={<Admin />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;