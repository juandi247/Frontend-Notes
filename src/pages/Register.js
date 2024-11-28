import React, { useState,useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigate } from "react-router-dom"; // Importa el hook useNavigate

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");





  const navigate = useNavigate(); // Inicializa useNavigate
  const API_URL = "https://backendnotes-production.up.railway.app/auth/register";


  const validateToken = async () => {
    const token = await AsyncStorage.getItem('authToken');

    if (token) {
      try {
        // Hacer una solicitud al API de validación del token
        const response = await fetch('https://backendnotes-production.up.railway.app/auth/register', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("TOKENNNN", token)

        // Si la validación es exitosa, redirigir al home
        if (data===true) {
          navigate('/home');
          console.log("BIEN")
     
        } else {
          // Si no es válido, redirigir al login
          navigate('/register');
          console.log("MAL")
        }
      } catch (error) {
        // En caso de error en la validación
        console.error('Error al validar el token:', error);
        navigate('/register');
      }
    } else {
      // Si no hay token, redirigir al login
      navigate('/register');
    }
  };

  useEffect(() => {
    validateToken();
  }, []);

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación de contraseñas
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setError(""); // Reinicia el error si pasa la validación

    // Estructura del cuerpo del request
    const requestBody = {
      username: username,
      password: password,
    };

    try {
      // Petición POST al API
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        // Guarda el token en AsyncStorage
        await AsyncStorage.setItem("authToken", data.token);
        setSuccessMessage("Account created successfully!");
        setTimeout(() => {
          setSuccessMessage(""); 
          navigate("/"); 
        }, 2000); 
      } else {
        setError(data.message || "An error occurred. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the server. Please try again later.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md relative">
        <div className="flex justify-center mb-4">
          <span className="text-5xl">📝</span>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800">Create Account</h2>
        <p className="text-sm text-center text-gray-600 mb-2">
          Start organizing your notes effortlessly
        </p>
        
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <div className="mt-1">
              <input
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1">
              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <div className="mt-1">
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          {/* Error Message */}
          {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-black rounded-lg hover:bg-gray-800"
          >
            Register
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm">
            Already have an account? <a href="/" className="text-indigo-500">Sign In</a>
          </p>
        </div>
        {/* Success Modal */}
        {successMessage && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-4 rounded-lg shadow-lg text-center animate-fadeIn">
              <h3 className="text-lg font-semibold text-green-600">🎉 Success!</h3>
              <p className="text-sm text-gray-700">{successMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;
