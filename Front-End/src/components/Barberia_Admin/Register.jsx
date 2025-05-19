import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const generos = ["Masculino", "Femenino", "Otro"];

const Register = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    fechaNacimiento: "",
    genero: "",
    email: "",
    dni: "",
    celular: "",
    contrasena: "",
    repeatPassword: "",
    terminos: false,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const notyf = new Notyf({
    duration: 3000,
    position: {
      x: 'right',
      y: 'top',
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleNext = (e) => {
    e.preventDefault();
    setError("");
    
    if (step === 1) {
      if (!form.nombre || !form.apellido || !form.fechaNacimiento || !form.genero) {
        setError("Por favor completa todos los campos");
        return;
      }
      if (!isNameValid(form.nombre) || !isNameValid(form.apellido)) {
        setError("El nombre y apellido solo deben contener letras");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!form.email || !form.dni || !form.celular) {
        setError("Por favor completa todos los campos");
        return;
      }
      if (!isEmailValid(form.email)) {
        setError("Por favor ingresa un email válido");
        return;
      }
      if (!isDNIValid(form.dni)) {
        setError("El DNI debe tener 8 dígitos");
        return;
      }
      if (!isPhoneValid(form.celular)) {
        setError("El número de celular debe tener 10 dígitos");
        return;
      }
      setStep(3);
    }
  };

  // Funciones de validación
  const isNameValid = (name) => /^[A-Za-záéíóúñÁÉÍÓÚÑ\s]+$/.test(name);
  const isEmailValid = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isDNIValid = (dni) => /^\d{8}$/.test(dni);
  const isPhoneValid = (phone) => /^\d{10}$/.test(phone);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!form.contrasena || !form.repeatPassword) {
      setError("Por favor completa todos los campos");
      return;
    }
    if (form.contrasena !== form.repeatPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (!form.terminos) {
      setError("Debes aceptar los términos y condiciones");
      return;
    }

    try {
      const datosCliente = {
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        dni: form.dni,
        telefono: form.celular,
        fecha_nacimiento: form.fechaNacimiento,
        genero: form.genero,
        contrasena: form.contrasena
      };

      const response = await axios.post('http://localhost:3001/api/clientes/register', datosCliente);
      
      if (response.data) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("cliente_id", response.data.cliente?.id);
        localStorage.setItem("tipoUsuario", "cliente");
        
        notyf.success("¡Registro exitoso!");
        navigate("/");
      }
    } catch (error) {
      console.error("Error al registrar:", error);
      const mensajeError = error.response?.data?.message || "Error al registrar el usuario";
      setError(mensajeError);
      notyf.error(mensajeError);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8f8f8]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Registro de Usuario</h2>
        {error && (
          <div className="mb-4 p-3 rounded bg-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={step === 3 ? handleRegister : handleNext} className="space-y-4">
          {step === 1 && (
            <>
              <div>
                <label className="block mb-1">Nombre</label>
                <input
                  type="text"
                  name="nombre"
                  value={form.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Apellido</label>
                <input
                  type="text"
                  name="apellido"
                  value={form.apellido}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Fecha de nacimiento</label>
                <input
                  type="date"
                  name="fechaNacimiento"
                  value={form.fechaNacimiento}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Género</label>
                <select
                  name="genero"
                  value={form.genero}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  required
                >
                  <option value="">Selecciona una opción</option>
                  {generos.map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>
              <button type="submit" className="w-full bg-[#224e1a] text-white py-2 rounded hover:bg-[#0E3C09] transition">
                Continuar
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <div>
                <label className="block mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">DNI (8 dígitos)</label>
                <input
                  type="text"
                  name="dni"
                  value={form.dni}
                  maxLength="8"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Número de celular (10 dígitos)</label>
                <input
                  type="tel"
                  name="celular"
                  value={form.celular}
                  maxLength="10"
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              <div className="flex justify-between">
                <button type="button" onClick={() => setStep(1)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
                  Atrás
                </button>
                <button type="submit" className="w-32 bg-[#224e1a] text-white py-2 rounded hover:bg-[#0E3C09] transition">
                  Continuar
                </button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <label className="block mb-1">Contraseña</label>
                <input
                  type="password"
                  name="contrasena"
                  value={form.contrasena}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Repetir contraseña</label>
                <input
                  type="password"
                  name="repeatPassword"
                  value={form.repeatPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="terminos"
                  checked={form.terminos}
                  onChange={handleChange}
                  className="mr-2"
                  required
                />
                <span className="text-sm">
                  Acepto los <a href="#" className="underline text-[#224e1a]">términos y condiciones</a> y la{" "}
                  <a href="#" className="underline text-[#224e1a]">política de privacidad</a>
                </span>
              </div>
              <div className="flex justify-between">
                <button type="button" onClick={() => setStep(2)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">
                  Atrás
                </button>
                <button type="submit" className="w-32 bg-[#224e1a] text-white py-2 rounded hover:bg-[#0E3C09] transition">
                  Registrarse
                </button>
              </div>
            </>
          )}
        </form>
        <div className="mt-4 text-center">
          <span>¿Ya tienes cuenta? </span>
          <button className="text-[#224e1a] underline" onClick={() => navigate("/login")}>
            Inicia sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default Register;