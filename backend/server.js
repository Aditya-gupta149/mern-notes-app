const dotenv = require("dotenv");
dotenv.config();

const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB Connected");
}).catch((err) => {
    console.log(err);
    process.exit(1);
});

const cookieParser = require("cookie-parser");

app.use(cookieParser());

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");

app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});