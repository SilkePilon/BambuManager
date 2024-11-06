import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Camera, PlusCircle, SettingsIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface Printer {
  name: string;
  username: string;
  timeRemaining: string;
  endTime: string;
  img: string;
}

const PrinterOverviewCard = ({ printer }: { printer: Printer }) => {
  return (
    <div className="rounded-xl bg-muted/50 p-4 flex flex-col gap-4">
      <div className="">
        <div className="items-center">
          <center>
            <span className="font-medium">
              <strong>{printer.name}</strong>
            </span>
          </center>
        </div>
      </div>
      <div className="aspect-video rounded-xl bg-muted/75">
        {/* Live camera view placeholder */}
        <img
          className="aspect-video rounded-xl bg-muted/75"
          src={printer.img}
          alt="Live Camera View"
        />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium">
            <strong>Started by</strong>
          </div>
          <div>{printer.username}</div>
        </div>

        <div>
          <div className="font-medium">
            <strong>Time Remaining</strong>
          </div>
          <div>{printer.timeRemaining}</div>
        </div>
        <div>
          <div className="font-medium">
            <strong>End Time</strong>
          </div>
          <div>{printer.endTime}</div>
        </div>
      </div>
      <div className="flex gap-2 mt-2">
        <Button className="flex-1" variant="secondary">
          <strong>View Details</strong>
        </Button>
        <Button className="w-30" variant="secondary">
          <SettingsIcon size={60} />
        </Button>
        <Button className="w-30" variant="destructive">
          <strong>Cancel Print</strong>
        </Button>
      </div>
    </div>
  );
};

const Page = () => {
  const printers = [
    {
      name: "P1S",
      username: "John Doe",
      timeRemaining: "1h 15m",
      endTime: "5:30 PM",
      img: "https://cdn.discordapp.com/attachments/1303822106848526346/1303855216151760927/p1s_1.gif?ex=672d454b&is=672bf3cb&hm=d8b79371b0b4c5068e4111a6fe9903d04f7e6dbaf349741b0e08c026d1e365ab&",
    },
    {
      name: "P1S",
      username: "Jane Smith",
      timeRemaining: "2h 30m",
      endTime: "6:45 PM",
      img: "https://cdn.discordapp.com/attachments/1303822106848526346/1303855215384199290/p1s_2.gif?ex=672d454b&is=672bf3cb&hm=31762e2a6fe0791544e63317498c59068a6de241198524b2a896c0868f4eaa24&",
    },
    {
      name: "A1",
      username: "Bob Johnson",
      timeRemaining: "45m",
      endTime: "4:15 PM",
      img: "https://cdn.discordapp.com/attachments/1303822106848526346/1303855214499205191/a1.gif?ex=672d454b&is=672bf3cb&hm=fc2079b9bb55fae961a4510539e97f5c01f5a04c71968197d405f9597265aef6&",
    },
  ];

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">General</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            {printers.map((printer, index) => (
              <PrinterOverviewCard key={index} printer={printer} />
            ))}
          </div>
          <Separator className="h-1 rounded-xl" />

          <AlertDialog>
            <center>
              <div
                style={{ maxWidth: "300px" }}
                className="rounded-xl bg-muted/50 p-4 flex flex-col gap-4 items-center text-center"
              >
                <div className="flex items-center gap-2">
                  <PlusCircle size={24} />
                  <span className="font-medium">Your printer not listed?</span>
                </div>
                <AlertDialogTrigger>
                  <Button variant={"secondary"} className="mt-3">
                    <strong>Add Printer</strong>
                  </Button>
                </AlertDialogTrigger>
              </div>
            </center>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Add New Printer</AlertDialogTitle>
              </AlertDialogHeader>
              <AlertDialogDescription>
                This will add a new printer to the system. Are you sure you want
                to proceed?
              </AlertDialogDescription>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction>Add Printer</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Page;
