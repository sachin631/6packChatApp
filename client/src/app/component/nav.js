'use client'
import { Button } from "@mui/material";
import React from "react";
import Typography from '@mui/material/Typography';
import Popover from '@mui/material/Popover';
import PopupState, { bindTrigger, bindPopover } from 'material-ui-popup-state';
import { useRouter } from "next/navigation";

const Nav = () => {
    let router=useRouter()
  return (
    <div>
      <section className="flex justify-between">
        <Button variant="contained" onClick={()=>{router.push('/')}}>Logo</Button>
        <div className="flex gap-2">
         

          <PopupState variant="popover" popupId="demo-popup-popover">
            {(popupState) => (
              <div>
                <Button variant="contained" {...bindTrigger(popupState)}>
                search
                </Button>
                <Popover
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <Typography sx={{ p: 2 }}>
                    <h1 className="text-2xl">Search</h1>
                    <input type="text" className="m-4 border-solid border-2 border-black rounded px-3" placeholder="find user and send req " />
                    <div className="flex flex-col gap-4 h-[30vh]">
                        <div className="flex gap-4 justify-center items-center">
                            <div>user1</div>
                            <Button variant="contained">send request</Button>
                        </div>
                        <div className="flex gap-4 justify-center items-center">
                            <div>user1</div>
                            <Button variant="contained">send request</Button>
                        </div>
                        <div className="flex gap-4 justify-center items-center">
                            <div>user1</div>
                            <Button variant="contained">send request</Button>
                        </div>
                    </div>
                  </Typography>
                </Popover>
              </div>
            )}
          </PopupState>

          <PopupState variant="popover" popupId="demo-popup-popover">
            {(popupState) => (
              <div>
                <Button variant="contained" {...bindTrigger(popupState)}>
                 create Group
                </Button>
                <Popover
                  {...bindPopover(popupState)}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "center",
                  }}
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "center",
                  }}
                >
                  <Typography sx={{ p: 2 }}>
                    <h1 className="text-2xl">New group</h1>
                    <input type="text" className="m-4 border-solid border-2 border-black rounded px-3" placeholder="group name " />
                    <div className="flex flex-col gap-4 h-[30vh]">
                        <div className="flex gap-4 justify-center items-center">
                            <div>user1</div>
                            <Button variant="contained">Add</Button>
                        </div>
                        <div className="flex gap-4 justify-center items-center">
                            <div>user1</div>
                            <Button variant="contained">Add</Button>
                        </div>
                        <div className="flex gap-4 justify-center items-center">
                            <div>user1</div>
                            <Button variant="contained">Add</Button>
                        </div>
                    </div>
                    <div className="flex justify-center items-center">
                         <Button variant="contained" className="flex justify-center items-center">Create</Button>
                    </div>
                    
                  </Typography>
                </Popover>
              </div>
            )}
          </PopupState>
          
          <Button variant="contained" onClick={()=>{router.push('/groups')}}>My Groups</Button>
          <Button variant="contained">notification</Button>
          <Button variant="contained">exit</Button>
        </div>
      </section>
    </div>
  );
};

export default Nav;
