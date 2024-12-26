const validator = require("validator");
const { all } = require("../routes/auth");
const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !lastName) {
    throw new Error(" Name fields are mandatory");
  } else if (firstName.length < 4 || firstName.length > 50) {
    throw new Error("First Name should be between 4 and 50 characters");
  } else if (!validator.isEmail(emailId)) {
    throw new Error("Invalid Email");
  } else if (!validator.isStrongPassword(password)) {
    throw new Error(
      "Password should be atleast 8 characters long and should contain atleast one lowercase, one uppercase, one numeric and one special character"
    );
  }
};

const validateProfileEditData = (req) => {
  const allowedEditFileds = [
    "firstName",
    "lastName",
    "emailId",
    "skills",
    "about",
    "photoUrl",
  ];

  const isEditAllowed = Object.keys(req.body).every((filed) =>
    allowedEditFileds.includes(filed)
  );

  return isEditAllowed;
};

module.exports = { validateSignUpData, validateProfileEditData };
