import React from "react";
import Layout from "./components/layout/Layout.jsx";
import AppRoutes from "./routes/AppRoutes.jsx";

export default function App() {
  return (
    <Layout>
      <AppRoutes />
    </Layout>
  );
}
