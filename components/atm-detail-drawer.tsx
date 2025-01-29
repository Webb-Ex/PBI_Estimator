import React from "react";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

import { X } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ATMCassettes } from "@/components/atm-cassettes";

interface ATMDetailsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  id?: number; // Pass ID or data for dynamic rendering
}

const ATMDetailsDrawer: React.FC<ATMDetailsDrawerProps> = ({
  isOpen,
  onClose,
  id,
}) => {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent>
        <DrawerHeader className="flex justify-between items-center py-0">
          <DrawerTitle className="">ATM {id} Details</DrawerTitle>
          <Button className="py-2 px-2" variant="outline" onClick={onClose}>
            <X />
          </Button>
        </DrawerHeader>
        <DrawerDescription className="p-4">
          <Tabs defaultValue="terminalCounter">
            <TabsList className="mb-3">
              <TabsTrigger disabled value="profileDetails">
                Profile Details
              </TabsTrigger>
              <TabsTrigger disabled value="componentDetails">
                Component Details
              </TabsTrigger>
              <TabsTrigger disabled value="devicehealth">
                Device Health
              </TabsTrigger>
              <TabsTrigger disabled value="supplyHealth">
                Supply Health
              </TabsTrigger>
              <TabsTrigger disabled value="terminalCounter">
                Terminal Counters
              </TabsTrigger>
              <TabsTrigger disabled value="cashThreshold">
                Cash Threshold
              </TabsTrigger>
            </TabsList>
            <TabsContent value="profileDetails">
              Make changes to your account here.
            </TabsContent>
            <TabsContent value="componentDetails">
              Change your password here.
            </TabsContent>
            <TabsContent value="devicehealth">
              Change your password here.
            </TabsContent>
            <TabsContent value="supplyHealth">
              Change your password here.
            </TabsContent>
            <TabsContent value="terminalCounter">
              <div className="mb-8">
                {/* <h2 className="text-md font-semibold mb-4 text-foreground">Cassettes</h2> */}
                <ATMCassettes />
              </div>
            </TabsContent>
            <TabsContent value="cashThreshold">
              Change your password here.
            </TabsContent>
          </Tabs>
        </DrawerDescription>
      </DrawerContent>
    </Drawer>
  );
};

export default ATMDetailsDrawer;
