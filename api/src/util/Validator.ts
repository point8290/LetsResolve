export const validateEmail = (email: string) => {
  const emailRegex = /\S+@\S+\.\S+/;
  if (!emailRegex.test(email)) {
    throw new Error("Invalid email format");
  }
  return email;
};
