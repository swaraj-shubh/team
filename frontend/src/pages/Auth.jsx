import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../firebase";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const navigate = useNavigate();

  const googleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // ✅ Save user locally
      localStorage.setItem("user", JSON.stringify({
        name: user.displayName,
        email: user.email,
        photo: user.photoURL
      }));

      navigate("/register"); // ✅ Redirect after login

    } catch (err) {
      alert("Google Login Failed");
    }
  };

  return (
    <div style={container}>
      <div style={card}>
        <h2>Welcome to Team Registration</h2>
        <p>Login to continue</p>

        <button onClick={googleLogin} style={googleBtn}>
          ✅ Continue with Google
        </button>
      </div>
    </div>
  );
}

const container = {
  minHeight: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(to right, #141e30, #243b55)"
};

const card = {
  background: "#fff",
  padding: 40,
  borderRadius: 12,
  textAlign: "center",
  width: 350
};

const googleBtn = {
  marginTop: 20,
  width: "100%",
  padding: 12,
  border: "none",
  borderRadius: 8,
  background: "#4285F4",
  color: "#fff",
  fontSize: 16,
  cursor: "pointer"
};
