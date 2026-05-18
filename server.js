require("rootpath")();
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

const errorHandler = require("_middleware/error-handler");
const { superAdminSeed } = require("./_seeders/super-admin-seeder");
const { init } = require("./socket");
const { runSeeds } = require("./seed");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

// CORS configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "https://frontend-grado-production.up.railway.app",
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.error(`CORS blocked origin: ${origin}`);
      console.error(`Allowed origins: ${allowedOrigins.join(", ")}`);
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["set-cookie"],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || "development",
  });
});

// api routes
app.use("/accounts", require("./accounts/accounts.controller"));
app.use("/subjects", require("./subjects/subject.controller"));
app.use(
  "/teacher-subject-assignment",
  require("./teacher_subject_assignment/teacher_subject.controller"),
);
app.use("/students", require("./students/student.controller"));
app.use("/enrollments", require("./enrollments/enrollment.controller"));
app.use("/quizzes", require("./quizzes/quiz.controller"));
app.use("/quiz-scores", require("./quiz_scores/quiz_score.controller"));
app.use(
  "/curriculum-subjects",
  require("./curriculum_subjects/curriculum_subject.controller"),
);
app.use("/homerooms", require("./homerooms/homeroom.controller"));
app.use("/grade-level", require("./grade_level/grade_level.controller"));
app.use("/final-grades", require("./final_grades/final-grade.controller"));
app.use("/school-year", require("./school_year/school_year.controller"));
app.use("/strand", require("./strands/strand.controller"));
app.use(
  "/subject-quarter-locks",
  require("./subject_quarter_locks/subject_quarter_lock.controller"),
);
app.use("/notifications", require("./notifications/notification.controller"));
app.use("/api-docs", require("./_helpers/swagger"));

// global error handler
app.use(errorHandler);

const port = process.env.PORT || 4000;

const server = http.createServer(app);
init(server);

server.listen(port, async () => {
  console.log(`LISTENING ON PORT ${port}`);
  console.log(`Environment: ${process.env.NODE_ENV}`);
  console.log(
    `FRONTEND_URL env variable: ${process.env.FRONTEND_URL || "NOT SET"}`,
  );
  console.log(`Allowed CORS origins: ${allowedOrigins.join(", ")}`);

  try {
    // Run seeds - seeders have built-in duplicate prevention (findOrCreate)
    await superAdminSeed();
    await runSeeds();
    console.log("🌱 All initial seeds executed successfully!");
  } catch (err) {
    console.error("❌ Seeding failed on server start:", err);
  }
});
