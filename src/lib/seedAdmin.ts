import config from "./config";
import User from "../models/User.model";

export const seedAdmin = async () => {
  const email = config.seeding_acc_email?.trim().toLowerCase();
  const name = config.seeding_acc_name?.trim() || "Admin";
  const password = config.seeding_acc_pass;

  if (!email || !password) {
    console.log("⚠️ Seed admin skipped: missing ADMIN_SEEDING_ACCOUNT_EMAIL or ADMIN_SEEDING_ACCOUNT_PASSWORD");
    return;
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    console.log(`✅ Admin already exists: ${email}`);
    return;
  }

  await User.create({
    name,
    email,
    password,
    role: "admin",
  });

  console.log(`✅ Seed admin created: ${email}`);
};
