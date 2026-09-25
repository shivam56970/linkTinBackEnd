const validation = require("validator");
const loginValidation = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (
    firstName.length < 4 ||
    firstName.length > 50 ||
    lastName.length < 4 ||
    lastName.length > 50
){
    throw new Error(
      "First name and last name should be between 4 to 50 characters"
    );
  }
  if (!validation.isEmail(emailId)) {
    throw new Error("Email is not valid");
  }
  if (!validation.isStrongPassword(password)) {
    throw new Error("Password should be strong");
  }
};
module.exports = {
  loginValidation,
};
