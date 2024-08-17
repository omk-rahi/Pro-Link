import axios from "axios";

const instance = axios.create({
  baseURL: `${import.meta.env.VITE_REACT_SERVER_URL}/auth`,
  withCredentials: true,
});

export const login = async ({ email, password }) => {
  const res = await instance.post("/login", { email, password });
  return res;
};

export const register = async ({
  fullname,
  email,
  password,
  confirmPassword,
}) => {
  const res = await instance.post("/signup", {
    fullName: fullname,
    email,
    password,
    confirmPassword,
  });
  return res;
};

export const getCurrentUser = async () => {
  const res = await instance.get("/me");
  return res;
};
