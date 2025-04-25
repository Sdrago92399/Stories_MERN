import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/Login";
import Registration from "./components/Registration";
import StoriesList from "./components/StoriesList";
import StorySubmissionForm from "./components/StorySubmissionForm";
import AdminDashboard from "./components/AdminDashboard"; // Admin Dashboard
import Header from "./components/Header";
import useAuth from "@/redux/dispatch/useAuth";
import { Toaster } from "sonner";

const App = () => {
  const { auth } = useAuth();
  const [user, setUser] = useState(auth.user);

  useEffect(() => {
    if (auth.user) {
      console.log(auth.user)
      setUser(auth.user);
    }
  }, [auth.user]);

  return (
    <Router>
      {user && <Header />}
      <Toaster position="top-center" richColors />

      <Routes>
        {/* ADMIN ROUTES */}
        {user?.isAdmin && (
          <Route
            path="/admin"
            element={<AdminDashboard />}
          />
        )}

        {/* PUBLIC ROUTES */}
        <Route
          path="/login"
          element={user ? <Navigate to={user.isAdmin ? "/admin" : "/stories"} replace /> : <Login setUser={setUser} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate to={user.isAdmin ? "/admin" : "/stories"} replace /> : <Registration setUser={setUser} />}
        />

        {/* USER PROTECTED ROUTES */}
        {!user?.isAdmin && (
          <>
            <Route
              path="/stories"
              element={user ? <StoriesList /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/stories/create"
              element={user ? <StorySubmissionForm /> : <Navigate to="/login" replace />}
            />
          </>
        )}

        {/* CATCH-ALL */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
