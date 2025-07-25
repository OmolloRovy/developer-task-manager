import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import API from "../services/api"; // Assuming this is your axios instance
import { Link } from "react-router-dom";

// It's good practice to import auth functions if they manage token logic
import { decodeToken, getUserFromToken } from '../utils/auth'; // Assuming auth.js exports these

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); // State to display specific error messages

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Email and password are required."); // Set error message
      return;
    }
    setLoading(true);
    setError(""); // Clear previous errors

    try {
      const res = await API.post("/auth/login", { email, password });

      // Axios automatically throws for 4xx/5xx, so if we reach here, it's a 2xx response.
      // Now, explicitly check if the token exists in the successful response.
      if (res.data && res.data.token) {
        localStorage.setItem("token", res.data.token);
        // Optionally, decode the token here and perform checks if needed before navigating
        const decodedUser = decodeToken(res.data.token);
        if (decodedUser) {
          navigate("/dashboard");
        } else {
          setError("Login failed: Could not decode token received.");
          localStorage.removeItem("token"); // Clean up malformed token if any
        }
      } else {
        setError("Login failed: No token received from server.");
      }
    } catch (err) {
      // This block catches network errors or non-2xx responses from the backend
      if (err.response) {
        // Backend responded with a status code outside 2xx
        setError(err.response.data?.message || `Login failed (Status: ${err.response.status})`);
      } else if (err.request) {
        // The request was made but no response was received (e.g., backend down)
        setError("Network error: Server did not respond. Is the backend running?");
      } else {
        // Something else happened
        setError("An unexpected error occurred during login.");
      }
      localStorage.removeItem("token"); // Always ensure no invalid token is left
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-zinc-900 px-4">
      <Card className="w-full max-w-md shadow-xl animate-fade">
        <CardHeader>
          <CardTitle className="text-center text-2xl font-bold">Log In</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 text-sm text-center">{error}</p>} {/* Display error */}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={handleLogin} disabled={loading} className="w-full">
            {loading ? "Logging in..." : "Log In"}
          </Button>
        </CardFooter>

        <p className="text-sm text-center text-zinc-600 dark:text-zinc-300 mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign Up
          </Link>
        </p>
      </Card>
    </div>
  );
}