const validator = require("validator");

const validationForTheEdit = (req) => {
  const { firstName, lastName, photoUrl, age, gender, talent } = req.body;
  const editableFields = ["firstName", "lastName", "photoUrl", "age", "gender", "talent"];

  // Editable fields check first
  const canEdit = Object.keys(req.body).every((field) =>
    editableFields.includes(field)
  );
  if (!canEdit) {
    throw new Error("You cannot edit the chosen field. Retry.");
  }

  // First name check (only if provided)
  if (firstName && (firstName.length < 4 || firstName.length > 50)) {
    throw new Error("First name should be between 4 to 50 characters");
  }

  // Last name check (only if provided)
  if (lastName && (lastName.length < 4 || lastName.length > 50)) {
    throw new Error("Last name should be between 4 to 50 characters");
  }

  // Age check (only if provided)
  if (age && (isNaN(age) || age < 0 || age > 120)) {
    throw new Error("Age must be a valid number between 0 and 120");
  }

  return true;
};

module.exports = validationForTheEdit;
