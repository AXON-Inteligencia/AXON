import { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import PlayStorePage from "./pages/PlayStorePage";
import RastreioPage from "./pages/RastreioPage";

function getRouteInfo() {
  const path = window.location.pathname;

  if (path === "/login") {
    return { route: "login" as const };
  }

  const playstoreMatch = path.match(/^\/playstore\/(\d+)/);
  if (playstoreMatch) {
    return { route: "playstore" as const, id: parseInt(playstoreMatch[1], 10) };
  }

  const rastreioMatch = path.match(/^\/rastreio\/(.+)/);
  if (rastreioMatch) {
    return { route: "rastreio" as const, orderNumber: decodeURIComponent(rastreioMatch[1]) };
  }

  return { route: "app" as const };
}

export default function App() {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("auth_token")
  );
  const [page, setPage] = useState<"landing" | "login" | "dashboard">("landing");

  const routeInfo = getRouteInfo();

  useEffect(() => {
    if (token) {
      localStorage.setItem("auth_token", token);
      setPage("dashboard");
    } else {
      localStorage.removeItem("auth_token");
    }
  }, [token]);

  useEffect(() => {
    if (routeInfo.route === "login") {
      setPage("login");
    }
  }, []);

  if (routeInfo.route === "playstore") {
    return <PlayStorePage appId={routeInfo.id} />;
  }

  if (routeInfo.route === "rastreio") {
    return <RastreioPage orderNumber={routeInfo.orderNumber} />;
  }

  const handleLogin = (newToken: string) => {
    setToken(newToken);
    setPage("dashboard");
  };

  const handleLogout = () => {
    setToken(null);
    setPage("landing");
  };

  const goToLogin = () => {
    setPage("login");
    window.history.pushState({}, "", "/login");
  };

  if (token && page === "dashboard") {
    return <Dashboard onLogout={handleLogout} />;
  }

  if (page === "login") {
    return <LoginPage onLogin={handleLogin} />;
  }

  if (token) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return <LandingPage onGoToLogin={goToLogin} />;
}
