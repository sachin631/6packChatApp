"use client";
import { Box, Button, TextField, Typography } from "@mui/material";
import React from "react";
import { useRouter } from "next/navigation";

const page = () => {
    const router=useRouter();

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
            label="name"
            type="text"
            autoComplete="current-password"
            className="text-white border-solid border-red-500"
          />
          <TextField
            id="outlined-password-input"
            label="email"
            type="email"
            autoComplete="current-password"
            className="text-white"
          />
          <TextField
            id="outlined-password-input"
            label="passwod"
            type="password"
            autoComplete="current-password"
            className="text-white"
          />
          <TextField
            id="outlined-password-input"
            label="bio"
            type="text"
            autoComplete="current-password"
            className="text-white"
          />
          <Button variant="contained"> Login </Button>
          <Button variant="contained" className="mt-4" onClick={() => router.push("/signup")}>
            SignUp
          </Button>
        </Box>
      </div>
    </div>
  );
};

export default page;
