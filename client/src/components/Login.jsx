import "./AuthSwitcher.css";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/slices/user.slice";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const helperText = {
  email: {
    required: "Email gereklidir",
    invalid: "Geçersiz e-posta",
  },
  password: {
    required: "Şifre gereklidir",
    short: "Şifre çok kısa",
  },
};

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (value) => {
    try {
      if (value.username) {
        const res = await dispatch(loginUser(value));
        console.log(res.payload);
        alert(res.payload);
        reset();
      } else {
        const res = await dispatch(loginUser(value));

        alert(res.payload.message);

        // reset();
      }
    } catch (error) {
      console.error("Giriş yaparken hata oluştu:", error);
    }
  };

  return (
    <div className="auth-container">
      <form className={`signup-box`} onSubmit={handleSubmit(onSubmit)}>
        <h2 className="text-center text-2xl font-bold">Login</h2>
        <input
          type="email"
          placeholder="Email"
          {...register("email", {
            required: helperText.email.required,
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: helperText.email.invalid,
            },
          })}
        />
        {errors.email && <p className="error">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Password"
          {...register("password", {
            required: helperText.password.required,
            minLength: {
              value: 6,
              message: helperText.password.short,
            },
          })}
        />
        {errors.password && <p className="error">{errors.password.message}</p>}

        <div className="buttons flex gap-5 mt-5">
          <button type="submit" className="bg-blue-600">Login</button>
          <button type="submit" className="bg-red-600">
            <Link to="/authentication">Signup</Link>
          </button>
        </div>
      </form>
    </div>
  );
}
