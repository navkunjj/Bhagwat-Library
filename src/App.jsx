import React from "react";
import { Layout } from "./components/Layout";
import { Dashboard } from "./pages/Dashboard";
import { StudentList } from "./pages/StudentList";
import { BatchList } from "./pages/BatchList";
import { PaymentList } from "./pages/PaymentList";

function App() {
  const [activeTab, setActiveTab] = React.useState("dashboard");

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
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
}

export default App;
