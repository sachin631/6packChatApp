"use client";
import { Box, Button, TextField, Typography } from "@mui/material";
import React from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form"
import axios_client from "../lib/axio.lib";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const page = () => {
  const router = useRouter();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();

  const on_submit = async (data) => {
    mutation.mutate(data);
  }

  let mutation = useMutation({
    mutationFn: async (data) => {
      const res = await axios_client.post("/user/login", data,);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success("user login successfully");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    },
    onError: (error) => {
      console.error("Error:", error);
      if (error.response && error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  })

  return (
    <div>
      <h1 className="text-[2vw] text-center">Login Page</h1>
      <div className="flex justify-center items-center">
        <Box
          component="form"
          sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
          noValidate
          autoComplete="off"
          className="flex flex-col"
        >

          <TextField
            id="outlined-password-input"
            label="email"
            type="email"
            autoComplete="current-password"
            className="text-white"
            {...register('email', { required: true })}
          />
          {errors.email && <p className="text-red-500">email is required</p>}
          <TextField
            id="outlined-password-input"
            label="passwod"
            type="password"
            autoComplete="current-password"
            className="text-white"
            {...register('password', { required: true })}
          />
          {errors.password && <p className="text-red-500">password is required</p>}

          <Button type="submit" variant="contained" onClick={handleSubmit(on_submit)}> Login </Button>
          <Button variant="contained" className="mt-4" onClick={() => router.push("/signup")}>
            SignUp
          </Button>
        </Box>
      </div>
      <ToastContainer />
    </div>
  );
};

export default page;
