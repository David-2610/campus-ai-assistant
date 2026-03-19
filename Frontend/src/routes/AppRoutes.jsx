import { Routes, Route } from "react-router-dom";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import Home from "@/pages/Home";

import ProtectedRoute from "@/routes/ProtectedRoute";
import AdminRoute from "@/routes/AdminRoute";

const AppRoutes = () => {
	return (
		<Routes>
			{/* PUBLIC ROUTES */}
			<Route path="/login" element={<Login />} />
			<Route path="/register" element={<Register />} />

			{/* PROTECTED ROUTES (USER + ADMIN) */}
			<Route element={<ProtectedRoute />}>
				<Route path="/" element={<Home />} />
				<Route path="/resources" element={<h1>Resources</h1>} />
				<Route path="/upload" element={<h1>Upload</h1>} />
			</Route>

			{/* ADMIN ROUTES */}
			<Route element={<AdminRoute />}>
				<Route
					path="/admin/dashboard"
					element={<h1>Admin Dashboard</h1>}
				/>
				<Route
					path="/admin/resources"
					element={<h1>Manage Resources</h1>}
				/>
			</Route>
		</Routes>
	);
};

export default AppRoutes;
