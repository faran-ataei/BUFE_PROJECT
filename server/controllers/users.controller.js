import VerifyEmail from "../model/verifyEmail.model.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

// ۱. ثبت نام کاربر
const registerUser = async (req, res) => {
  const { password, ...restOfData } = req.body;
  try {
    const existingUser = await User.findOne({ email: restOfData.email });

    if (existingUser) {
      return res.status(404).json({ message: "Kullanıcı zaten mevcut" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      password: hashedPassword,
      ...restOfData,
    });

    const newVerifyEmail = new VerifyEmail({
      userId: newUser._id,
      token: crypto.randomBytes(32).toString("hex"),
    });

    const message = `E-postanızı doğrulamak için lütfen aşağıdaki bağlantıya tıklayın: ${process.env.BASE_URL}/api/users/verify/${newUser._id}/${newVerifyEmail.token}`;

    await sendEmail(newUser.email, "E-postanızı doğrulayın", message);

    await newUser.save();
    await newVerifyEmail.save();

    res.status(201).json({
      message: "Kullanıcı başarıyla kaydoldu. Lütfen e-postanızı kontrol edin.",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ۲. تایید ایمیل
const verifyUserEmail = async (req, res) => {
  try {
    const { id: userId, token } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }

    const verifyToken = await VerifyEmail.findOne({ userId });
    if (!token || !verifyToken || token !== verifyToken.token) {
      return res.status(400).json({ message: "Geçersiz doğrulama belirteci" });
    }

    user.verified = true;
    await user.save();
    await verifyToken.deleteOne();

    res.status(200).json({ message: "E-posta başarıyla doğrulandı" });
  } catch (error) {
    console.error("Error verifying user email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ۳. ارسال مجدد ایمیل تایید
const resendVerificationEmail = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Geçersiz e-posta veya şifre" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "E-posta zaten doğrulandı" });
    }

    await VerifyEmail.findOneAndDelete({ userId: user._id });

    const token = crypto.randomBytes(32).toString("hex");
    const newVerifyEmail = new VerifyEmail({ userId: user._id, token });
    await newVerifyEmail.save();

    const message = `E-postanızı doğrulamak برای تایید ایمیل کلیک کنید: ${process.env.BASE_URL}/api/users/verify/${user._id}/${token}`;
    await sendEmail(user.email, "E-postanızı doğrulayın", message);

    res.status(200).json({ message: "Doğrulama e-postası gönderildi." });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ۴. ورود کاربر (اصلاح شده برای رفع خطای ۴۰۳)
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Geçersiz e-posta veya şifre" });
    }

    if (!user.verified) {
      return res.status(401).json({ message: "Lütfen e-postanızı doğrulayın" });
    }

    // زمان انقضا برای جلوگیری از خطای ۴۰۳ به ۷ روز تغییر یافت
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000, // ۷ روز
    };

    res.cookie("token", token, cookieOptions);

    const responseData = {
      message: "Başarıyla giriş yapıldı",
      user: user.name,
      lastName: user.lastName,
      email: user.email,
    };

    if (user.admin) responseData.admin = true;

    res.status(200).json(responseData);
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "İç Sunucu Hatası" });
  }
};

// ۵. خروج کاربر
const logoutUser = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.status(200).json({ message: "Başarıyla çıkیش yapıldı" });
  } catch (error) {
    res.status(500).json({ message: "İç Sunucu Hatası" });
  }
};

export { registerUser, verifyUserEmail, resendVerificationEmail, loginUser, logoutUser };