"use client";

import { Button } from "./ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";

const TSizeComponent = () => {
  return (
    <div className="border m-1 w-[35%]">
        <Drawer>
        <DrawerTrigger asChild>
            <Button variant="outline">Open Drawer</Button>
        </DrawerTrigger>
        <DrawerContent>
            <div className="mx-auto w-full max-w-sm">
            <DrawerHeader>
                <DrawerTitle>T-Size</DrawerTitle>
                <DrawerDescription></DrawerDescription>
            </DrawerHeader>

            <DrawerFooter>
                <DrawerClose asChild>
                <Button variant="outline">Cancel</Button>
                </DrawerClose>
            </DrawerFooter>
            </div>
        </DrawerContent>
        </Drawer>
        
    </div>
  );
};

export default TSizeComponent;
