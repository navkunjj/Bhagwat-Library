import React from "react";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { StudentList } from "./pages/StudentList";
import { BatchList } from "./pages/BatchList";
import { PaymentList } from "./pages/PaymentList";
import { Login } from "./pages/Login";

const App = () => {
  const [activeTab, setActiveTab] = React.useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [isAuthenticated, setIsAuthenticated] = React.useState(false);
  const [theme, setTheme] = React.useState(
    localStorage.getItem("theme") || "dark"
  );

  React.useEffect(() => {
    const loggedIn = sessionStorage.getItem("isLoggedIn");
    if (loggedIn === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  React.useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  const handleLogin = () => {
    sessionStorage.setItem("isLoggedIn", "true");
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard onTabChange={setActiveTab} />;
      case "students":
        return <StudentList />;
      case "batches":
        return <BatchList />;
      case "payments":
        return <PaymentList />;
      default:
        return <Dashboard onTabChange={setActiveTab} />;
    }
  };

  return (
    <Layout
      activeTab={activeTab}
      onTabChange={setActiveTab}
      theme={theme}
      toggleTheme={toggleTheme}
    >
      {renderContent()}
    </Layout>
  );
};

export default App;
