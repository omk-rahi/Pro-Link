import { useForm } from "react-hook-form";
import { FiArrowUpRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useMutation } from "react-query";

import { login, register as userRegister } from "../../services/authServices";

import FormRow from "../components/FormRow";
import Button from "../components/Button";
import Row from "../components/Row";
import HyperLink from "../components/HyperLink";

const Register = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const navigate = useNavigate();

  const { mutate, isLoading } = useMutation({
    mutationKey: ["register"],
    mutationFn: userRegister,

    onSuccess: (data) => {
      toast.success(data.data.message);
      // navigate("/", { replace: true });
    },

    onError: (err) => {
      const errorMessage = err.response.data.message;
      console.log(errorMessage);
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
        <h1 className="text-4xl font-semibold">Register</h1>
        <p>Hi, Welcome 👋</p>

        <FormRow name="fullname" error={errors?.fullname?.message}>
          <input
            type="text"
            placeholder="E.g. John Doe"
            className="w-full rounded-md border px-6 py-2 outline-none ring-blue-600 invalid:ring-red-600 focus:ring-1"
            {...register("fullname", {
              required: "Please enter your name",
            })}
          />
        </FormRow>

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
            placeholder="Choose a password"
            className="w-full rounded-md border px-6 py-2 outline-none ring-blue-600 invalid:ring-red-600 focus:ring-1"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be 8 character long",
              },
            })}
          />
        </FormRow>

        <FormRow
          name="confirmPassword"
          label="Confirm password"
          error={errors?.confirmPassword?.message}
        >
          <input
            type="password"
            placeholder="Confirm your password"
            className="w-full rounded-md border px-6 py-2 outline-none ring-blue-600 invalid:ring-red-600 focus:ring-1"
            {...register("confirmPassword", {
              required: "Confirm password is required",
              validate: (value) =>
                value === getValues().password || "Password does not match",
            })}
          />
        </FormRow>

        <Button type="submit" isLoading={isLoading}>
          Register
        </Button>
        <div className="flex items-center justify-center">
          Already registered ?&nbsp;
          <HyperLink to="/login">
            <span className="flex items-center justify-center gap-2">
              Login <FiArrowUpRight />
            </span>
          </HyperLink>
        </div>
      </Row>
    </form>
  );
};

export default Register;
