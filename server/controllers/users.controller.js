import VerifyEmail from "../model/verifyEmail.model.js";
import crypto from "crypto";
import sendEmail from "../utils/sendEmail.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/user.model.js";

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

    const newVerifyEmail = await VerifyEmail({
      userId: newUser._id,
      token: crypto.randomBytes(32).toString("hex"),
    });

    const message = `E-postanızı doğrulamak için lütfen aşağıdaki bağlantıya tıklayın: ${process.env.BASE_URL}/api/users/verify/${newUser._id}/${newVerifyEmail.token}`;

    await sendEmail(newUser.email, "E-postanızı doğrulayın", message);

    await newUser.save();
    await newVerifyEmail.save();

    res.status(201).json({
      message:
        "Kullanıcı başarıyla kaydoldu. Lütfen hesabınızı doğrulamak için e-postanızı kontrol edin.",
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const verifyUserEmail = async (req, res) => {
  try {
    const { id: userId, token } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    }
    const verifyToken = await VerifyEmail.findOne({
      userId: userId,
    });
    if (!token || !verifyToken) {
      return res.status(400).json({ message: "Geçersiz doğrulama belirteci" });
    }
    if (token !== verifyToken.token) {
      return res.status(400).json({ message: "Geçersiz doğrulama belirteci" });
    }

    user.verified = true;
    await user.save();
    await verifyToken.deleteOne();

    res
      .status(200)
      .send();
  } catch (error) {
    console.error("Error verifying user email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const resendVerificationEmail = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "E-posta ve şifre gereklidir." });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Geçersiz e-posta veya şifre" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Geçersiz e-posta veya şifre" });
    }

    if (user.verified) {
      return res.status(400).json({ message: "E-posta zaten doğrulandı" });
    }

    // Check for existing active token
    const existingToken = await VerifyEmail.findOne({ userId: user._id });
    if (existingToken) {
      return res.status(429).json({
        message:
          "Doğrulama e-postası zaten gönderildi. Lütfen süresi dolana kadar bekleyin.",
      });
    }

    // Create new token
    const token = crypto.randomBytes(32).toString("hex");
    const newVerifyEmail = new VerifyEmail({
      userId: user._id,
      token,
    });

    await newVerifyEmail.save();

    const message = `E-postanızı doğrulamak için lütfen aşağıdaki bağlantıya tıklayın: ${process.env.BASE_URL}/api/users/verify/${user._id}/${token}`;
    await sendEmail(user.email, "E-postanızı doğrulayın", message);

    res
      .status(200)
      .json({ message: "Doğrulama e-postası başarıyla yeniden gönderildi." });
  } catch (error) {
    console.error("Error resending verification email:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: "Geçersiz e-posta veya şifre" });
    }

    // Check if password is correct
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Geçersiz e-posta veya şifre" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30m",
    });

    // Check if user is verified email before login
    if (!user.verified) {
      return res
        .status(401)
        .json({ message: "Lütfen e-postanızı doğrulayın" });
    }

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    };

    // Set cookie
    res.cookie("token", token, cookieOptions);

    // Response
    const responseData = {
      message: "Başarıyla giriş yapıldı",
      user: user.username,
      email: user.email,
    };

    if (user.admin) {
      responseData.admin = true;
    }
    console.log(user);
    res.status(200).json(responseData);
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ message: "İç Sunucu Hatası" });
  }
};

const logoutUser = async (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      return res.status(401).json({ message: "Kullanıcı giriş yapmamış" });
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });

    res.status(200).json({ message: "Başarıyla çıkış yapıldı" });
  } catch (error) {
    console.error("Error logging out user:", error);
    res.status(500).json({ message: "İç Sunucu Hatası" });
  }
};


export { registerUser, verifyUserEmail, resendVerificationEmail, loginUser, logoutUser };
