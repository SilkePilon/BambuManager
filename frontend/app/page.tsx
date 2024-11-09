"use client";

import React, { useState, useRef } from "react";
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
import {
  PlusCircle,
  HelpCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import PrinterInfoCard from "@/components/printer-info-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import { TutorialPopup } from "@/components/tutorial-popup";

interface Printer {
  name: string;
  type: string;
  hotendTemp: number;
  bedTemp: number;
  printTime: string;
  startedBy: string;
  cameraUrl: string;
  filamentType: string;
  layerHeight: number;
  printProgress: number;
  layerProgress: number;
  totalLayers: number;
  estimatedTimeLeft: string;
  gcodeUrl?: string;
  printerStatus: "printing" | "completed" | "idle";
  lightOn: boolean;
  fanSpeed: number;
  isPrinting: boolean;
}

const initialPrinters: Printer[] = [
  {
    name: "Creeper",
    type: "P1S",
    hotendTemp: 210,
    bedTemp: 60,
    printTime: "1h 30m",
    printerStatus: "printing",
    fanSpeed: 100,
    lightOn: true,
    startedBy: "John Doe",
    cameraUrl:
      "https://cdn.discordapp.com/attachments/1303822106848526346/1303855215384199290/p1s_2.gif?ex=672f3f8b&is=672dee0b&hm=dd80d6687d7f8d33b719b6b65f145c50ec727ac4c4b29b15e922b4d80e3c02d5&",
    filamentType: "PLA",
    layerHeight: 0.2,
    printProgress: 65,
    layerProgress: 42,
    totalLayers: 100,
    estimatedTimeLeft: "45m",
    gcodeUrl:
      "https://raw.githubusercontent.com/SilkePilon/BambuManager/refs/heads/main/examples/gcode/1.gcode",
    isPrinting: true,
  },
  {
    name: "Awww",
    type: "P1S",
    hotendTemp: 200,
    bedTemp: 55,
    printTime: "2h 15m",
    printerStatus: "idle",
    fanSpeed: 100,
    lightOn: true,
    startedBy: "Jane Smith",
    cameraUrl:
      "https://cdn.discordapp.com/attachments/1303822106848526346/1303855215384199290/p1s_2.gif?ex=672f3f8b&is=672dee0b&hm=dd80d6687d7f8d33b719b6b65f145c50ec727ac4c4b29b15e922b4d80e3c02d5&",
    filamentType: "PETG",
    layerHeight: 0.15,
    printProgress: 42,
    layerProgress: 105,
    totalLayers: 250,
    estimatedTimeLeft: "3h 10m",
    isPrinting: true,
  },
  {
    name: "Man",
    type: "A1",
    hotendTemp: 0,
    bedTemp: 0,
    printTime: "0m",
    printerStatus: "completed",
    fanSpeed: 100,
    lightOn: true,
    startedBy: "Bob Johnson",
    cameraUrl:
      "https://cdn.discordapp.com/attachments/1303822106848526346/1303855215384199290/p1s_2.gif?ex=672f3f8b&is=672dee0b&hm=dd80d6687d7f8d33b719b6b65f145c50ec727ac4c4b29b15e922b4d80e3c02d5&",
    filamentType: "ABS",
    layerHeight: 0.1,
    printProgress: 80,
    layerProgress: 160,
    totalLayers: 200,
    estimatedTimeLeft: "15m",
    isPrinting: true,
  },
];

const tutorialSlides = [
  {
    title: "Welcome to the 3D Printer Dashboard",
    content:
      "This dashboard allows you to monitor and control your 3D printers. Let's go through the main features.",
  },
  {
    title: "Printer Cards",
    content:
      "Each card represents a 3D printer. You can see the printer's status, current temperatures, and print progress at a glance.",
  },
  {
    title: "Detailed View",
    content:
      "Click on 'Details' to open a detailed view of the printer. Here you can adjust settings like temperature, fan speed, and print speed.",
  },
  {
    title: "Start/Stop Prints",
    content:
      "Use the 'Start Print' or 'Cancel' buttons to control your print jobs. You can also upload new G-code files to start a new print.",
  },
  {
    title: "Add New Printers",
    content:
      "Click the 'Add Printer' button at the bottom of the dashboard to add a new printer to your fleet.",
  },
];

export default function Dashboard() {
  const [printers, setPrinters] = useState<Printer[]>(initialPrinters);
  const [newPrinterName, setNewPrinterName] = useState("");
  const [newPrinterType, setNewPrinterType] = useState("");
  const [showTutorial, setShowTutorial] = useState(false);

  const handleAddPrinter = (name: string, type: string) => {
    const newPrinter: Printer = {
      name,
      type,
      hotendTemp: 0,
      bedTemp: 0,
      printTime: "0m",
      startedBy: "",
      cameraUrl: "/placeholder.svg?height=200&width=320",
      filamentType: "",
      printerStatus: "idle",
      lightOn: false,
      fanSpeed: 0,
      layerHeight: 0,
      printProgress: 0,
      layerProgress: 0,
      totalLayers: 0,
      estimatedTimeLeft: "0m",
      isPrinting: false,
    };
    setPrinters([...printers, newPrinter]);
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
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
          <div className="ml-auto mr-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowTutorial(true)}
            >
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
        </header>
        <ScrollArea className="flex-1">
          <div className="flex flex-col gap-4 p-4">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {printers.map((printer, index) => (
                <PrinterInfoCard
                  key={index}
                  {...printer}
                  onStopPrint={() => {
                    console.log(`Stopping print for ${printer.name}`);
                  }}
                  onHotendTempChange={(temp) => {
                    console.log(
                      `New hotend temperature for ${printer.name}:`,
                      temp
                    );
                  }}
                  onBedTempChange={(temp) => {
                    console.log(
                      `New bed temperature for ${printer.name}:`,
                      temp
                    );
                  }}
                  onLayerHeightChange={(height) => {
                    console.log(
                      `New layer height for ${printer.name}:`,
                      height
                    );
                  }}
                  onFilamentTypeChange={(type) => {
                    console.log(`New filament type for ${printer.name}:`, type);
                  }}
                  onPrintSpeedChange={(speed) => {
                    console.log(`New print speed for ${printer.name}:`, speed);
                  }}
                  onFanSpeedChange={(speed) => {
                    console.log(`New fan speed for ${printer.name}:`, speed);
                  }}
                  onLightToggle={(on) => {
                    console.log(
                      `Light for ${printer.name} turned ${on ? "on" : "off"}`
                    );
                  }}
                  onDownloadTimelapse={() => {
                    console.log(`Downloading timelapse for ${printer.name}`);
                  }}
                  onUploadGcode={async (file) => {
                    console.log(
                      `Uploading G-code for ${printer.name}:`,
                      file.name
                    );
                  }}
                />
              ))}
            </div>
            <Separator className="my-4" />
            <Dialog>
              <DialogTrigger asChild>
                <Button className="mx-auto w-40">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Printer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Printer</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new printer you want to add to the
                    system.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newPrinterName}
                      onChange={(e) => setNewPrinterName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Type
                    </Label>
                    <Input
                      id="type"
                      value={newPrinterType}
                      onChange={(e) => setNewPrinterType(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    onClick={() =>
                      handleAddPrinter(newPrinterName, newPrinterType)
                    }
                  >
                    Add Printer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </ScrollArea>
      </SidebarInset>
      <AnimatePresence>
        {showTutorial && (
          <TutorialPopup
            onClose={() => setShowTutorial(false)}
            onAddPrinter={handleAddPrinter}
          />
        )}
      </AnimatePresence>
    </SidebarProvider>
  );
}
