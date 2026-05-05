import { useState, useEffect } from "react";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import PlayStorePage from "./pages/PlayStorePage";
import RastreioPage from "./pages/RastreioPage";

function getRouteInfo() {
  const path = window.location.pathname;

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

  const routeInfo = getRouteInfo();

  useEffect(() => {
    if (token) {
      localStorage.setItem("auth_token", token);
    } else {
      localStorage.removeItem("auth_token");
    }
  }, [token]);

  if (routeInfo.route === "playstore") {
    return <PlayStorePage appId={routeInfo.id} />;
  }

  if (routeInfo.route === "rastreio") {
    return <RastreioPage orderNumber={routeInfo.orderNumber} />;
  }

  const handleLogin = (newToken: string) => {
    setToken(newToken);
  };

  const handleLogout = () => {
    setToken(null);
  };

  if (!token) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}
