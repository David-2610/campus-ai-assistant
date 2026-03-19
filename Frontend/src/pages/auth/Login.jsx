import { useState } from "react";
import api from "@/api/api";
import { useNavigate } from "react-router-dom";
import { setToken, setUser } from "@/utils/auth";


const Login = () => {
	const navigate = useNavigate();

	const [form, setForm] = useState({
		email: "",
		password: "",
	});

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			const res = await api.post("/auth/login", form);

			setToken(res.data.token);
			setUser(res.data.user);

			alert("Login successful");

			navigate("/");
		} catch (err) {
			alert(err.response?.data?.message || "Login failed");
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<form
				onSubmit={handleSubmit}
				className="bg-white p-6 rounded-lg shadow-md w-96"
			>
				<h2 className="text-xl font-bold mb-4">Login</h2>

				<input
					type="email"
					name="email"
					placeholder="Email"
					className="w-full mb-3 p-2 border rounded"
					onChange={handleChange}
					required
				/>

				<input
					type="password"
					name="password"
					placeholder="Password"
					className="w-full mb-3 p-2 border rounded"
					onChange={handleChange}
					required
				/>

				<button className="w-full bg-blue-600 text-white p-2 rounded">
					Login
				</button>

				<p className="mt-3 text-sm">
					Don't have an account?{" "}
					<span
						className="text-blue-600 cursor-pointer"
						onClick={() => navigate("/register")}
					>
						Register
					</span>
				</p>
			</form>
		</div>
	);
};

export default Login;
