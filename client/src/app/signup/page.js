"use client";
import { Button } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios_client from "../lib/axio.lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const Register = () => {

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();
  const router = useRouter();
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async (data) => {
      console.log("/asdasdasdasd+++++++++++++++++");
      const res = await axios_client.post("/user/register", data);
      console.log(res, "asasd=>>>>>>>>>>>>>>>>>");
      return res;
    },
    onSuccess: () => {
      toast.success("Form submitted successfully");
      queryClient.invalidateQueries(["user_list"]);
      setTimeout(() => {
        router.push("/login");
      }, 1000);
    },
    onError: (error) => {
      console.error("Error:", error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });

  const submit_button = (data) => {
    mutation.mutate(data);
  };

  return (
    <section className=" flex justify-center items-center h-[100vh]">
      <div className="flex flex-col justify-center items-center gap-4 shadow-black shadow-2xl px-6 py-6 ">
        <div>Register Section</div>
        <form
          onSubmit={handleSubmit(submit_button)}
          className="w-full flex flex-col gap-4"
        >
          <div className="flex flex-col text-black">
            <label> name</label>
            <input
              type="text"
              placeholder="First Name"
              {...register("name", {
                required: "First name is required",
              })}
              className="input-class text-black"
            />
            {errors.first_name && (
              <p className="text-red-500">{errors.first_name.message}</p>
            )}
          </div>
          <div className="flex flex-col text-black">
            <label>user bio</label>
            <input
              type="text"
              placeholder="bio"
              {...register("bio", { required: "bio is required" })}
              className="input-class"
            />
            {errors.bio && (
              <p className="text-red-500">{errors.bio.message}</p>
            )}
          </div>
          <div className="flex flex-col text-black">
            <label>email </label>
            <input
              type="email"
              placeholder="Email"
              {...register("email", { required: "Email is required" })}
              className="input-class"
            />
            {errors.email && (
              <p className="text-red-500">{errors.email.message}</p>
            )}
          </div>
          <div className="flex flex-col text-black">
            <label>password</label>
            <input
              type="password"
              placeholder="Password"
              {...register("password", { required: "Password is required" })}
              className="input-class"
            />
            {errors.password && (
              <p className="text-red-500">{errors.password.message}</p>
            )}
          </div>
          <Button type="primary" htmlType="submit" loading={mutation.isLoading}>
            Submit
          </Button>
        </form>
        <p className="text-blue-500 text-center">
          <Link href="/login">Login if you already have an account</Link>
        </p>
      </div>
      <ToastContainer />
    </section>
  );
};

export default Register;
