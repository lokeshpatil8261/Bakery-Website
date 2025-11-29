import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SetUsername = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [userInfo, setUserInfo] = useState({});
  const [message, setMessage] = useState("");
  const [warning, setWarning] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("userInfo");
    if (saved) {
      setUserInfo(JSON.parse(saved));
    } else {
      setMessage("⚠️ Session expired. Please register again.");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username) {
      setMessage("❌ Username is required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const payload = {
        username,
        email: userInfo.email,
        phone: userInfo.phone,
      };

      const res = await axios.post(
        `http://localhost:5000/api/auth/set-username`,
        payload
      );

      setMessage(
        res.data.message || "🎉 Username set! Account created successfully."
      );
      localStorage.removeItem("userInfo");

      setTimeout(() => navigate("/userHomePage"), 1500);
    } catch (err) {
      console.error("❌ Failed to set username:", err);
      setMessage(err.response?.data?.message || "❌ Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const input = e.target.value;

    // If there's a space or uppercase, show warning
    if (/[A-Z]/.test(input) || /\s/.test(input)) {
      setWarning(
        "⚠️ Only lowercase letters, numbers, and special symbols allowed. No spaces or capital letters."
      );
    } else {
      setWarning("");
    }

    // Transform input to lowercase and remove spaces
    const filtered = input.toLowerCase().replace(/\s/g, "");
    setUsername(filtered);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        id="set-username-form"
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Set Your Username
        </h2>

        {/* Username Input */}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 font-medium mb-1"
          >
            Username
          </label>

          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={handleChange}
            minLength={3}
            maxLength={20}
            required
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:outline-none ${
              warning
                ? "border-orange-400 focus:ring-orange-500"
                : "border-gray-300 focus:ring-blue-500"
            }`}
          />
        </div>

        {/* Warning Message */}
        {warning && (
          <p className="text-orange-500 text-sm mb-2 font-medium">{warning}</p>
        )}

        {/* Main Message */}
        {message && (
          <p className="text-center text-gray-700 text-sm font-medium mb-3">
            {message}
          </p>
        )}

        {/* Submit Button */}
        <button
          id="submit-btn"
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium 
                   hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Saving..." : "Submit"}
        </button>
      </form>
    </div>
  );
};

export default SetUsername;
