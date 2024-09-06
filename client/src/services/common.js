import { emailValidation } from "../../constants";

const validateEmail = (email) => {
  // Regular expression for email validation
  const re = emailValidation;
  return re.test(email);
};

export { validateEmail };
