import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {

    const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post("/users/login", formData);

      console.log(res.data);

      localStorage.setItem("token", res.data.token);

      alert("Login Successful ✅");
      navigate("/");

    } catch (error) {

      console.log(error);

      alert("Login Failed ❌");
    }
  };

  return (
    <div>

      <h1>Login Page</h1>

      <form onSubmit={handleSubmit}>

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          onChange={handleChange}
        />

        <br />
        <br />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          onChange={handleChange}
        />

        <br />
        <br />

        <button
  type="submit"
  style={{
    padding: "10px 20px",
    backgroundColor: "blue",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    marginTop: "10px"
  }}
>
  Login
</button>

      </form>

    </div>
  );
}

export default Login;