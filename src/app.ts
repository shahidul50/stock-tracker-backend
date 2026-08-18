import express, { type Application, type Request, type Response } from "express";
import cors from "cors";
import notFound from "./middlewares/notFound";
import errorHandler from "./middlewares/globalErrorHandler";

import authRoutes from "./modules/auth/auth.route";
import categoryRoutes from "./modules/category/category.route";
import companyRoutes from "./modules/company/company.route";

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

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/companies", companyRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;