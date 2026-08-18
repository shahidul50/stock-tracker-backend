import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const config = {
    port: process.env.PORT ? Number(process.env.PORT) : 5000,
    db_url: process.env.MONGODB_URI,
    node_env: process.env.NODE_ENV,
    jwt_secret: process.env.JWT_SECRET || "stock-trackr-super-secret",
    jwt_expires_in: process.env.JWT_EXPIRES_IN || "7d",
    seeding_acc_email: process.env.ADMIN_SEEDING_ACCOUNT_EMAIL,
    seeding_acc_name: process.env.ADMIN_SEEDING_ACCOUNT_NAME,
    seeding_acc_pass: process.env.ADMIN_SEEDING_ACCOUNT_PASSWORD,
};

export default config;