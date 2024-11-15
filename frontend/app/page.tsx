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
  Settings,
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
import TutorialPopup from "@/components/tutorial-popup";

interface Printer {
  printerName: string;
  printerType: string;
  fallbackImageUrl: string;
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
    printerName: "Ender 3 Pro",
    printerType: "FDM",
    fallbackImageUrl: "/placeholder.svg?height=200&width=320",
    hotendTemp: 200,
    bedTemp: 60,
    printTime: "2h 30m",
    startedBy: "John Doe",
    cameraUrl: "https://example.com/printer1-stream",
    filamentType: "PLA",
    layerHeight: 0.2,
    printProgress: 45,
    layerProgress: 50,
    totalLayers: 100,
    estimatedTimeLeft: "3h 15m",
    printerStatus: "printing",
    lightOn: true,
    fanSpeed: 100,
    isPrinting: true,
  },
  {
    printerName: "Prusa i3 MK3S+",
    printerType: "FDM",
    fallbackImageUrl: "/placeholder.svg?height=200&width=320",
    hotendTemp: 210,
    bedTemp: 65,
    printTime: "1h 45m",
    startedBy: "Jane Smith",
    cameraUrl: "https://example.com/printer2-stream",
    filamentType: "PETG",
    layerHeight: 0.15,
    printProgress: 30,
    layerProgress: 30,
    totalLayers: 150,
    estimatedTimeLeft: "4h 30m",
    printerStatus: "printing",
    lightOn: false,
    fanSpeed: 80,
    isPrinting: true,
  },
  {
    printerName: "Elegoo Mars 2 Pro",
    printerType: "Resin",
    fallbackImageUrl: "/placeholder.svg?height=200&width=320",
    hotendTemp: 0,
    bedTemp: 0,
    printTime: "0h 0m",
    startedBy: "N/A",
    cameraUrl: "https://example.com/printer3-stream",
    filamentType: "Standard Resin",
    layerHeight: 0.05,
    printProgress: 0,
    layerProgress: 0,
    totalLayers: 0,
    estimatedTimeLeft: "0h 0m",
    printerStatus: "idle",
    lightOn: false,
    fanSpeed: 0,
    isPrinting: false,
  },
  {
    printerName: "Creality CR-10",
    printerType: "FDM",
    fallbackImageUrl: "/placeholder.svg?height=200&width=320",
    hotendTemp: 0,
    bedTemp: 0,
    printTime: "5h 20m",
    startedBy: "Bob Johnson",
    cameraUrl: "https://example.com/printer4-stream",
    filamentType: "ABS",
    layerHeight: 0.1,
    printProgress: 100,
    layerProgress: 200,
    totalLayers: 200,
    estimatedTimeLeft: "0h 0m",
    printerStatus: "completed",
    lightOn: false,
    fanSpeed: 0,
    isPrinting: false,
  },
];

export default function Dashboard() {
  const [printers, setPrinters] = useState<Printer[]>(initialPrinters);
  const [newPrinterName, setNewPrinterName] = useState("");
  const [newPrinterType, setNewPrinterType] = useState("");
  const [showTutorial, setShowTutorial] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);

  const handleAddPrinter = (printerName: string, printerType: string) => {
    const newPrinter: Printer = {
      printerName,
      printerType,
      fallbackImageUrl: "/placeholder.svg?height=200&width=320",
      hotendTemp: 0,
      bedTemp: 0,
      printTime: "0h 0m",
      startedBy: "N/A",
      cameraUrl: "https://example.com/new-printer-stream",
      filamentType: "PLA",
      layerHeight: 0.2,
      printProgress: 0,
      layerProgress: 0,
      totalLayers: 0,
      estimatedTimeLeft: "0h 0m",
      printerStatus: "idle",
      lightOn: false,
      fanSpeed: 0,
      isPrinting: false,
    };
    setPrinters([...printers, newPrinter]);
    setNewPrinterName("");
    setNewPrinterType("");
  };

  const toggleAdvancedOptions = () => {
    setShowAdvancedOptions(!showAdvancedOptions);
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
          <div className="ml-auto mr-4 flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-40">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Printer
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Printer</DialogTitle>
                  <DialogDescription>
                    Enter the details of the new printer you want to add.
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

            <Button
              variant="outline"
              size="icon"
              onClick={toggleAdvancedOptions}
              aria-label={
                showAdvancedOptions
                  ? "Hide Advanced Options"
                  : "Show Advanced Options"
              }
            >
              <Settings className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowTutorial(true)}
              aria-label="Show Tutorial"
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
                    console.log(`Stopping print for ${printer.printerName}`);
                    const updatedPrinters = [...printers];
                    updatedPrinters[index] = {
                      ...printer,
                      printerStatus: "idle",
                      isPrinting: false,
                      printProgress: 0,
                      layerProgress: 0,
                      estimatedTimeLeft: "0h 0m",
                    };
                    setPrinters(updatedPrinters);
                  }}
                  onHotendTempChange={(temp) => {
                    console.log(
                      `New hotend temperature for ${printer.printerName}:`,
                      temp
                    );
                    const updatedPrinters = [...printers];
                    updatedPrinters[index] = { ...printer, hotendTemp: temp };
                    setPrinters(updatedPrinters);
                  }}
                  onBedTempChange={(temp) => {
                    console.log(
                      `New bed temperature for ${printer.printerName}:`,
                      temp
                    );
                    const updatedPrinters = [...printers];
                    updatedPrinters[index] = { ...printer, bedTemp: temp };
                    setPrinters(updatedPrinters);
                  }}
                  onLayerHeightChange={(height) => {
                    console.log(
                      `New layer height for ${printer.printerName}:`,
                      height
                    );
                    const updatedPrinters = [...printers];
                    updatedPrinters[index] = {
                      ...printer,
                      layerHeight: height,
                    };
                    setPrinters(updatedPrinters);
                  }}
                  onFilamentTypeChange={(type) => {
                    console.log(
                      `New filament type for ${printer.printerName}:`,
                      type
                    );
                    const updatedPrinters = [...printers];
                    updatedPrinters[index] = { ...printer, filamentType: type };
                    setPrinters(updatedPrinters);
                  }}
                  onPrintSpeedChange={(speed) => {
                    console.log(
                      `New print speed for ${printer.printerName}:`,
                      speed
                    );
                    // Note: We're not updating the state here as print speed is not part of our Printer interface
                    // You may want to add this to the Printer interface if you want to track it
                  }}
                  onFanSpeedChange={(speed) => {
                    console.log(
                      `New fan speed for ${printer.printerName}:`,
                      speed
                    );
                    const updatedPrinters = [...printers];
                    updatedPrinters[index] = { ...printer, fanSpeed: speed };
                    setPrinters(updatedPrinters);
                  }}
                  onLightToggle={(on) => {
                    console.log(
                      `Light for ${printer.printerName} turned ${
                        on ? "on" : "off"
                      }`
                    );
                    const updatedPrinters = [...printers];
                    updatedPrinters[index] = { ...printer, lightOn: on };
                    setPrinters(updatedPrinters);
                  }}
                  onDownloadTimelapse={() => {
                    console.log(
                      `Downloading timelapse for ${printer.printerName}`
                    );
                    // Implement timelapse download logic here
                  }}
                  onUploadGcode={async (file) => {
                    console.log(
                      `Uploading G-code for ${printer.printerName}:`,
                      file.name
                    );
                    // Implement G-code upload logic here
                    // For now, we'll just simulate starting a new print
                    const updatedPrinters = [...printers];
                    updatedPrinters[index] = {
                      ...printer,
                      printerStatus: "printing",
                      isPrinting: true,
                      printProgress: 0,
                      layerProgress: 0,
                      totalLayers: 100, // This would normally be calculated from the G-code
                      estimatedTimeLeft: "5h 0m", // This would normally be calculated from the G-code
                      startedBy: "Current User", // This would normally be the logged-in user
                    };
                    setPrinters(updatedPrinters);
                  }}
                  showAdvancedOptions={showAdvancedOptions}
                />
              ))}
            </div>
          </div>
        </ScrollArea>
      </SidebarInset>
      <AnimatePresence>
        {showTutorial && (
          <TutorialPopup
            onAddPrinter={handleAddPrinter}
            onClose={() => setShowTutorial(false)}
          />
        )}
      </AnimatePresence>
    </SidebarProvider>
  );
}
