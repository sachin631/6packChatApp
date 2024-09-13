import { Button } from "@mui/material";
import React from "react";
import Nav from "../component/nav";
// 
const Group = () => {
  return (
    <div className="">
        <Nav/>
    <div className="h-[80vh] flex">
      <div>
        <h1 className=" text-center m-4 w-[20vw]">yours Groups </h1>
        <div className="flex flex-col gap-4 w-[20vw] overflow-auto">
          <Button variant="contained">user 1</Button>
          <Button variant="contained">user 1</Button>
          <Button variant="contained">user 1</Button>
          <Button variant="contained">user 1</Button>
          <Button variant="contained">user 1</Button>
          <Button variant="contained">user 1</Button>
          <Button variant="contained">user 1</Button>
          <Button variant="contained">user 1</Button>
          <Button variant="contained">user 1</Button>
          <Button variant="contained">user 1</Button>
          <Button variant="contained">user 1</Button>
          <Button variant="contained">user 1</Button>
          <Button variant="contained">user 1</Button>
          <Button variant="contained">user 1</Button>
          <Button variant="contained">user 1</Button>
          <Button variant="contained">user 1</Button>
          <Button variant="contained">user 1</Button>
          <Button variant="contained">user 1</Button>
        </div>
      </div>
      <div className="w-[80vw] m-4">
        <h1>Group name 1</h1>
        <div className="flex flex-col gap-4">
          <div className="flex gap-4">
            <Button variant="contained">user 1</Button>
            <Button variant="contained" className="bg-red-500">
              delete
            </Button>
          </div>
          <div className="flex gap-4">
            <Button variant="contained">user 1</Button>
            <Button variant="contained" className="bg-red-500">
              delete
            </Button>
          </div>
          <div className="flex gap-4">
            <Button variant="contained">user 1</Button>
            <Button variant="contained" className="bg-red-500">
              delete
            </Button>
          </div>
          <div className="flex gap-4">
            <Button variant="contained">user 1</Button>
            <Button variant="contained" className="bg-red-500">
              delete
            </Button>
          </div>
          <div className="flex gap-4">
            <Button variant="contained">user 1</Button>
            <Button variant="contained" className="bg-red-500">
              delete
            </Button>
          </div>
          <div className="flex gap-4">
            <Button variant="contained">user 1</Button>
            <Button variant="contained" className="bg-red-500">
              delete
            </Button>
          </div>
          <div className="flex gap-4">
            <Button variant="contained">user 1</Button>
            <Button variant="contained" className="bg-red-500">
              delete
            </Button>
          </div>
          <div className="flex gap-4">
            <Button variant="contained">user 1</Button>
            <Button variant="contained" className="bg-red-500">
              delete
            </Button>
          </div>
        </div>
        <div className="flex m-4">
          <div className="flex gap-4">
            <Button variant="contained" className="bg-red-500">
              Delete Group
            </Button>
            <Button variant="contained" className="bg-red-500">
              + Add Members
            </Button>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Group;
