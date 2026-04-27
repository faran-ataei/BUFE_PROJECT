import { useState } from "react";
import "./AuthSwitcher.css";
import { useDispatch } from "react-redux";
import { loginUser, registerNewUser } from "../redux/slices/user.slice";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

const helperText = {
  email: {
    required: "Email gereklidir",
    invalid: "Geçersiz e-posta",
  },
  password: {
    required: "Şifre gereklidir",
    short: "Şifre çok kısa",
  },
  fullName: {
    required: "Kullanıcı adı gereklidir",
    invalid: "Geçersiz kullanıcı adı",
  },
};

export default function Signup() {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });

  const onSubmit = async (value) => {
    console.log(value);
    try {
      if (value.username) {
        const res = await dispatch(registerNewUser(value));
        console.log(res.payload);
        alert(res.payload);
        reset();
      } else {
        const res = await dispatch(loginUser(value));
        console.log(res);

          alert(res.payload);

        // reset();
      }
    } catch (error) {
      console.error("Giriş yaparken hata oluştu:", error);
    }
  };

  return (
    <div className="auth-container">
      <form
        className={`signup-box`}
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2>Signup</h2>
        <input
          type="text"
          placeholder="Full Name"
          {...register("username", {
            required: helperText.fullName.required,
            minLength: {
              value: 3,
              message: helperText.fullName.invalid,
            },
          })}
        />
        {errors.fullName && <p className="error">{errors.fullName.message}</p>}

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
          <button type="submit" className="bg-blue-600">Signup</button>
          <button type="submit" className="bg-red-600">
            <Link to="/login">Login</Link>
          </button>
        </div>
      </form>
    </div>
  );
}
