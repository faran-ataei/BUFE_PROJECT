import express from "express";
import "dotenv/config";
import cors from "cors";
import connectDB from "./db/connectDB.js";
import cookieParser from "cookie-parser";
import usersRoutes from "./routes/users.route.js";
import productsRoutes from "./routes/products.route.js";


const app = express();

app.use(
  express.json(),
  express.urlencoded({ extended: true }),
  cors(),
  cookieParser()
);


app.use("/api/users",usersRoutes)
app.use("/api/products",productsRoutes)



const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    app.listen(port, () => {
      console.log(`Server is running on url: http://localhost:${port}`);
    });
  } catch (err) {
    console.log(err);
  }
};

start();