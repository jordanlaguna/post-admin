import { useState } from "react";
import {
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword
  } from "firebase/auth";
  import { FcGoogle } from "react-icons/fc";
  import { motion, AnimatePresence } from "framer-motion";
  import {
    collection,
    where,
    getDocs,
    query,
    setDoc,
    doc
  } from "firebase/firestore";
import { auth, db } from "../../../src/firebaseConfig";
import { useNavigate } from "react-router-dom";
  
  export default function Login() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [error, setError] = useState("");
    const [isLogin, setIsLogin] = useState(true);
    const navigate = useNavigate();
  
    const handleLogin = async () => {
      try {
        if (!email || !password) {
          setError("Debes rellenar todos los campos");
          return;
        }
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/dashboard/home");
      } catch (error) {
        setError("Credenciales incorrectas");
      }
    };
  
    const handleGoogleLogin = async () => {
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
        navigate("/home");
      } catch (error) {
        setError("Error al iniciar sesión con Google");
      }
    };
  
    const handleRegister = async () => {
      try {
        const userRef = collection(db, "user");
        const queryDb = await getDocs(
          query(userRef, where("email", "==", email))
        );
        if (!name || !email || !password || !phone) {
          setError("Debes rellenar todos los campos");
          return;
        }
        if (!queryDb.empty) {
          setError("El usuario ya existe");
          return;
        }
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const uid = userCredential.user.uid;
  
        const userDoc = {
          uid,
          name,
          email,
          phone,
        };
  
        await setDoc(doc(db, "user", uid), userDoc);
        navigate("/dashboard/home");
      } catch (error) {
        setError("Error al crear la cuenta");
      }
    };
  const handleToggleLogin = () => {
    setIsLogin(!isLogin);
  };

  const textVariants = {
    initial: { x: 0 },
    animate: { x: isLogin ? 0 : 400 },
    exit: { x: 0 }
  };

  const formVariants = {
    initial: { opacity: 0, x: isLogin ? -400 : 0 },
    animate: { opacity: 1, x: isLogin ? 0 : -400 },
    exit: { opacity: 0, x: isLogin ? -400 : -400 }
  };

  return (
    <>
    <div className="h-screen flex justify-center items-center bg-gray-100">
        <div className="bg-white shadow-xl rounded-md overflow-hidden flex w-[800px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login-text" : "register-text"}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={textVariants}
              transition={{ duration: 0.4 }}
              className="w-1/2 bg-blue-600 text-white p-8 flex flex-col justify-center items-center"
            >
              <img
                src="/images/Logo.png"
                alt="Not found"
                width="300"
                height="300"
                className="mb-2"
              />
              <h2 className="text-2xl mb-4">
                {isLogin
                  ? "Bienvenido de nuevo a Post-Admin!"
                  : "Bienvenido a Post-Admin!"}
              </h2>

              <p className="mb-8">
                {isLogin
                  ? "Por favor Inicia Sesión con tus datos"
                  : "Para unirte por favor regístrate con tus datos"}
              </p>

              <button
                onClick={handleToggleLogin}
                className="bg-white text-blue-600 py-2 px-4 rounded hover:bg-gray-200 transition duration-200"
              >
                {isLogin ? "No tienes una cuenta?" : "Ya tienes una cuenta?"}
              </button>
            </motion.div>
          </AnimatePresence>
          <AnimatePresence mode="wait">
            <motion.div
              key={isLogin ? "login-form" : "register-form"}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={formVariants}
              transition={{ duration: 0.3 }}
              className="w-1/2 p-8"
            >
              <h1 className="text-2xl font-semibold mb-6 text-center">
                {isLogin ? "Iniciar Sesión" : "Crear una Cuenta"}
              </h1>
              {!isLogin && (
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder=""
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="input-style"
                    autoFocus
                  />
                  <label className="input-label">Nombre</label>
                </div>
              )}
              <div className="relative mb-4">
                <input
                  type="email"
                  placeholder=""
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-style"
                  autoFocus
                />
                <label className="input-label">Correo Electrónico</label>
              </div>
              <div className="relative mb-4">
                <input
                  type="password"
                  placeholder=""
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-style"
                />
                <label className="input-label">Contraseña</label>
              </div>
              {!isLogin && (
                <div className="relative mb-4">
                  <input
                    type="tel"
                    placeholder=""
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="input-style"
                  />
                  <label className="input-label">Teléfono</label>
                </div>
              )}
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <button
                onClick={isLogin ? handleLogin : handleRegister}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
              >
                {isLogin ? "Iniciar Sesión" : "Registrarse"}
              </button>
              <div className="flex items-center my-4 bg-gray-100">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-4 text-gray-600">o</span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>
              <button
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center bg-green-500 text-white py-2 rounded mb-4 hover:bg-green-400 transition duration-200"
              >
                <FcGoogle className="mr-2" size={24} />
                {isLogin
                  ? "Iniciar sesión con Google"
                  : "Registrarse con Google"}
              </button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};
