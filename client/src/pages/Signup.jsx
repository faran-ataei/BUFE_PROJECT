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
  name: {
    required: "Kullanıcı adı gereklidir",
    invalid: "Geçersiz kullanıcı adı",
  },
  lastName: {
    required: "Soyad gereklidir",
    invalid: "Geçersiz soyad",
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
      name: "",
      lastName: "",
    },
  });

  const onSubmit = async (value) => {
    console.log(value);
    try {
      if (value.name) {
        const res = await dispatch(registerNewUser(value));
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
        <h2 className="text-center text-2xl font-bold">Hesap oluştur</h2>
        <input
          type="text"
          placeholder="Ad"
          {...register("name", {
            required: helperText.name.required,
            minLength: {
              value: 3,
              message: helperText.name.invalid,
            },
          })}
        />
        {errors.name && <p className="error">{errors.name.message}</p>}

        <input
          type="text"
          placeholder="Soyad"
          {...register("lastName", {
            required: helperText.lastName.required,
            minLength: {
              value: 3,
              message: helperText.lastName.invalid,
            },
          })}
        />
        {errors.lastName && <p className="error">{errors.lastName.message}</p>}

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
        </div>
      </form>
    </div>
  );
}
