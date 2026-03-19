import { useState } from "react";
import api from "@/api/api";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    branch: "",
    semester: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", form);

      alert("Registered successfully");

      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-md w-96"
      >
        <h2 className="text-xl font-bold mb-4">Register</h2>

        <input name="name" placeholder="Name" className="input" onChange={handleChange} required />
        <input name="email" placeholder="Email" className="input" onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" className="input" onChange={handleChange} required />
        <input name="branch" placeholder="Branch" className="input" onChange={handleChange} required />
        <input name="semester" placeholder="Semester" className="input mb-3" onChange={handleChange} required />

        <button className="w-full bg-green-600 text-white p-2 rounded">
          Register
        </button>

        <p className="mt-3 text-sm">
          Already have an account?{" "}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default Register;