import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "@/api/api";
import Input from "@/components/ui/Input";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useAuth } from "@/context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Display success message from registration if present
  const successMessage = location.state?.message;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate form before submission
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/login", form);

      // Call login from AuthContext and redirect to home
      login(response.data.token, response.data.user);
      navigate("/");
    } catch (err) {
      const errorMessage = err.response?.data?.message || "Login failed. Please try again.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-light px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl border border-brand-peach/30 shadow-md p-8">
          <h2 className="text-3xl font-bold text-brand-dark mb-6 text-center">
            Login
          </h2>

          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-700 font-medium">{successMessage}</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              name="email"
              label="Email Address"
              value={form.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              error={errors.email}
            />

            <Input
              type="password"
              name="password"
              label="Password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              error={errors.password}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand-maroon text-white font-bold py-3 px-4 rounded-lg hover:bg-brand-dark shadow-sm focus:outline-none focus:ring-4 focus:ring-brand-maroon/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="small" />
                  <span className="ml-2">Logging in...</span>
                </div>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-brand-dark/70">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="text-brand-orange hover:text-brand-maroon font-bold transition-colors"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
