const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");
const {
    errorResponseHandler,
    invalidPathHandler,
} = require("./middleware/errorHandler");

// Routes
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
const commentRoutes = require("./routes/commentRoutes");
const postCategoriesRoutes = require("./routes/postCategoriesRoutes");

const app = express();
dotenv.config();
connectDB();
app.use(express.json());
app.use(cors());

// Returns middleware that only parses json and only looks at requests where the Content-Type header matches the type option.

app.get("/", (req, res) => {
    res.send("Server is running...");
});

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/post-categories", postCategoriesRoutes);

// static assets
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

app.use(invalidPathHandler);
app.use(errorResponseHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log("Server is up and listening on port " + PORT);
});
