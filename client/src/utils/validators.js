// Small client-side form validators (the server validates again – never trust the client alone).
const EMAIL = /^\S+@\S+\.\S+$/;

export const validateLogin = ({ email, password }) => {
  const e = {};
  if (!EMAIL.test(email.trim())) e.email = 'Enter a valid email address.';
  if (!password) e.password = 'Password is required.';
  return e;
};

export const validateRegister = ({ name, email, password }) => {
  const e = {};
  if (name.trim().length < 2) e.name = 'Name must be at least 2 characters.';
  if (!EMAIL.test(email.trim())) e.email = 'Enter a valid email address.';
  if (password.length < 6) e.password = 'Password must be at least 6 characters.';
  return e;
};
