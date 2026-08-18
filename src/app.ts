import express, { type Application, type Request, type Response } from "express";
import cors from "cors";
import notFound from "./middlewares/notFound";
import errorHandler from "./middlewares/globalErrorHandler";

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Stock tracker API is running",
  });
});


app.use(notFound);
app.use(errorHandler);

export default app;