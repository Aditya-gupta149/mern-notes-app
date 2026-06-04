import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Register() {
    const navigate = useNavigate();
    const { getCurrentUser } = useAuth();

    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });

    // Handle input changes
    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate fields
        if (
            !formData.username ||
            !formData.email ||
            !formData.password
        ) {
            return toast.error("Please fill all fields");
        }

        try {
            setLoading(true);

            const { data } = await API.post(
                "/users/signup",
                formData
            );

            // Refresh auth state
            await getCurrentUser();

            toast.success(data.message);

            navigate("/");

        } catch (error) {
            toast.error(
                error?.response?.data?.message ||
                "Registration failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Register</h1>

            <form onSubmit={handleSubmit}>

                <input
                    type="text"
                    name="username"
                    placeholder="Enter Username"
                    value={formData.username}
                    onChange={handleChange}
                />

                <br />
                <br />

                <input
                    type="email"
                    name="email"
                    placeholder="Enter Email"
                    value={formData.email}
                    onChange={handleChange}
                />

                <br />
                <br />

                <input
                    type="password"
                    name="password"
                    placeholder="Enter Password"
                    value={formData.password}
                    onChange={handleChange}
                />

                <br />
                <br />

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Register"}
                </button>

            </form>

            <br />

            <p>
                Already have an account?{" "}
                <Link to="/login">
                    Login
                </Link>
            </p>

        </div>
    );
}

export default Register;