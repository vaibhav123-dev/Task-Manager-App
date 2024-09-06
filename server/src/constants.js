export const DB_NAME = "task_management";
export const adminUserData = {
  name: "Admin User",
  title: "Administrator",
  role: "admin",
  email: process.env.ADMIN_EMAIL,
  password: process.env.ADMIN_PASSWORD,
  isAdmin: true,
  isActive: true
};
