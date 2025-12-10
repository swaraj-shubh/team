import axios from "axios";

export const verifyRecaptcha = async (token) => {
  if (!process.env.RECAPTCHA_SECRET) {
    // during development you can skip
    return true;
  }

  const secret = process.env.RECAPTCHA_SECRET;

  const url = `https://www.google.com/recaptcha/api/siteverify`;

  const params = new URLSearchParams();
  params.append("secret", secret);
  params.append("response", token);

  const { data } = await axios.post(url, params);

  return data.success;
};
