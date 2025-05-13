import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    password: "",
    repeatPassword: "",
    terminos: false,
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

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
        setError("Completa todos los campos");
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!form.email || !form.dni || !form.celular) {
        setError("Completa todos los campos");
        return;
      }
      setStep(3);
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setError("");
    if (!form.password || !form.repeatPassword) {
      setError("Completa todos los campos");
      return;
    }
    if (form.password !== form.repeatPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    if (!form.terminos) {
      setError("Debes aceptar los términos y condiciones");
      return;
    }
    // Guardar usuario ficticio
    localStorage.setItem("user", JSON.stringify(form));
    localStorage.setItem("token", "fake-token");
    navigate("/");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#f8f8f8]">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Registro de Usuario</h2>
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
              <button type="submit" className="w-full bg-[#224e1a] text-white py-2 rounded hover:bg-[#0E3C09] transition">Continuar</button>
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
                <label className="block mb-1">DNI</label>
                <input
                  type="text"
                  name="dni"
                  value={form.dni}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block mb-1">Número de celular</label>
                <input
                  type="tel"
                  name="celular"
                  value={form.celular}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded"
                  required
                />
              </div>
              <button type="button" onClick={() => setStep(1)} className="mr-2 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Atrás</button>
              <button type="submit" className="w-[60%] bg-[#224e1a] text-white py-2 rounded hover:bg-[#0E3C09] transition">Continuar</button>
            </>
          )}
          {step === 3 && (
            <>
              <div>
                <label className="block mb-1">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  value={form.password}
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
                <span className="text-sm">Acepto los <a href="#" className="underline text-[#224e1a]">términos y condiciones</a> y la <a href="#" className="underline text-[#224e1a]">política de privacidad</a></span>
              </div>
              <button type="button" onClick={() => setStep(2)} className="mr-2 px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Atrás</button>
              <button type="submit" className="w-[60%] bg-[#224e1a] text-white py-2 rounded hover:bg-[#0E3C09] transition">Terminar</button>
            </>
          )}
          {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
        </form>
        <div className="mt-4 text-center">
          <span>¿Ya tienes cuenta? </span>
          <button className="text-[#224e1a] underline" onClick={() => navigate("/login")}>Inicia sesión</button>
        </div>
      </div>
    </div>
  );
};

export default Register; 