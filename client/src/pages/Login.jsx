import { useForm } from "react-hook-form";
import { FiArrowUpRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useMutation } from "react-query";

import { login } from "../services/authServices";

import FormRow from "../components/FormRow";
import Button from "../components/Button";
import Row from "../components/Row";
import HyperLink from "../components/HyperLink";
import { useEffect } from "react";
import { useUser } from "../hooks/authHooks";

const Login = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();

  const { user, isLoading: isLoadingUser } = useUser();

  useEffect(() => {
    if (!isLoadingUser && user) navigate("/");
  }, [isLoadingUser, user, navigate]);

  const { mutate, isLoading } = useMutation({
    mutationKey: ["login"],
    mutationFn: login,

    onSuccess: () => {
      toast.success("Logged in");
      navigate("/", { replace: true });
    },

    onError: (err) => {
      const errorMessage = err.response.data.message;
      toast.error(errorMessage);
    },
  });

  return (
    <form
      autoComplete="off"
      noValidate
      onSubmit={handleSubmit(mutate)}
      className="mx-auto my-12 w-1/4"
    >
      <Row>
        <h1 className="text-4xl font-semibold">Login</h1>
        <p>Hi, Welcome back 👋</p>

        <FormRow name="email" error={errors?.email?.message}>
          <input
            type="email"
            placeholder="E.g. johndoe@gmail.com"
            className="w-full rounded-md border px-6 py-2 outline-none ring-blue-600 invalid:ring-red-600 focus:ring-1"
            {...register("email", {
              required: "Email is required",
              validate: (value) =>
                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value) ||
                "Invalid email address",
            })}
          />
        </FormRow>

        <FormRow name="password" error={errors?.password?.message}>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full rounded-md border px-6 py-2 outline-none ring-blue-600 invalid:ring-red-600 focus:ring-1"
            {...register("password", {
              required: "Password is required",
            })}
          />
        </FormRow>

        <Button type="submit" isLoading={isLoading}>
          Login
        </Button>
        <div className="flex items-center justify-center">
          Not registered yet ?&nbsp;
          <HyperLink to="/register">
            <span className="flex items-center justify-center gap-2">
              Create an account <FiArrowUpRight />
            </span>
          </HyperLink>
        </div>
      </Row>
    </form>
  );
};

export default Login;
