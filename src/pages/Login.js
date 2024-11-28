import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Asegúrate de tener React Router configurado
import AsyncStorage from '@react-native-async-storage/async-storage';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Para redirigir después del login exitoso

  useEffect(() => {
    const validateToken = async () => {
      const token = await AsyncStorage.getItem('authToken');
  
      if (token) {
        setLoading(true);
        try {
          const response = await fetch('https://backendnotes-production.up.railway.app/auth/validate', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
  
          const data = await response.json();
          console.log("TOKENNNN", token);
  
          if (data === true) {
            navigate('/home');
            console.log("BIEN");
          } else {
            navigate('/');
            console.log("MAL");
            setLoading(false);
          }
        } catch (error) {
          console.error('Error al validar el token:', error);
          navigate('/');
          setLoading(false);
        }
      } else {
        navigate('/');
        setLoading(false);
      }
    };
  
    validateToken();
  }, [navigate]);  // Ya no es necesario agregar validateToken en las dependencias
  

  

  // Función para manejar el submit del formulario
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Activar el loading
    setError(null); // Limpiar errores previos

    try {
      // Realizar la solicitud POST al API de login
      const response = await fetch('https://backendnotes-production.up.railway.app/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username, // Nombre de usuario del formulario
          password: password, // Contraseña del formulario
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Si la respuesta es exitosa, guardar el token en AsyncStorage
        await AsyncStorage.setItem('authToken', data.token);

        // Redirigir al usuario al inicio de la aplicación (por ejemplo, /home)
        navigate('/home');
      } else {
        setError(data.message || 'Incorrect credentials');
      }
    } catch (error) {
      // Manejar errores de la solicitud (red, servidor, etc.)
      setError('Incorrect credentials, check again');
    } finally {
      setLoading(false); // Desactivar el loading
    }
  };


  // Mostrar spinner mientras validamos el token o el login
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
          <div className="flex justify-center mb-4">
            <span className="text-5xl">🔑</span>
          </div>
          <div className="flex justify-center">
            <div className="spinner-border animate-spin inline-block w-16 h-16 border-4 border-t-4 border-gray-200 rounded-full" role="status">
            </div>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-center mb-4">
          <span className="text-5xl">🔑</span>
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800">Welcome! Sign in to go with the notes</h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Enter your credentials to access your notes
        </p>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <div className="mt-1">
              <input
              
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <div className="mt-1">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2 text-white bg-black rounded-lg hover:bg-gray-800"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
        <div className="mt-4 text-center">
          <p className="text-sm">
            New to Notes? <a href="/register" className="text-indigo-500">Create an account</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
