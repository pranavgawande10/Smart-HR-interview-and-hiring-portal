import express from "express"
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());


app.get("/", (req, res) => {
  res.send("Heloo Rj");
});

import healthCheckRouter from "./src/routes/healthcheck.routes.js";
import candidateRouter from "./src/routes/candidate.routes.js";
import applicationRouter from "./src/routes/application.routes.js";
import jobRouter from "./src/routes/job.routes.js";
import hrrouter from "./src/routes/hr.routes.js";
import interviewerRouter from "./src/routes/interviewer.routes.js";

app.use("/api/v1/jobs", jobRouter);
app.use("/api/v1/application", applicationRouter);
app.use("/api/v1/healthCheck", healthCheckRouter);
app.use("/api/v1/candidates", candidateRouter);
app.use("/api/v1/hr", hrrouter);
app.use("/api/v1/interviewer", interviewerRouter);

export {app};