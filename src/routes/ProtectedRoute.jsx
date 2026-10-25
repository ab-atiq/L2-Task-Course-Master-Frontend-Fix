import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getToken } from "../utils/auth";
import { getMe } from "../services/auth.api";

export default function ProtectedRoute({ children }) {
  const [isValid, setIsValid] = useState(null);
  const token = getToken();

  useEffect(() => {
    if (!token) return;

    let active = true;
    getMe()
      .then(() => {
        if (active) setIsValid(true);
      })
      .catch(() => {
        if (active) setIsValid(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  if (!token || isValid === false) {
    return <Navigate to="/login" replace />;
  }

  if (isValid === null) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return children;
}
