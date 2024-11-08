"use client";

import React, { useState } from "react";
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
import { PlusCircle } from "lucide-react";
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
  stlUrl?: string;
  isPrinting: boolean;
}

const Page = () => {
  const [printers, setPrinters] = useState<Printer[]>([
    {
      name: "Stalker",
      type: "P1S",
      hotendTemp: 210,
      bedTemp: 60,
      printTime: "1h 30m",
      startedBy: "John Doe",
      cameraUrl:
        "https://cdn.discordapp.com/attachments/1303822106848526346/1303855216151760927/p1s_1.gif?ex=672d454b&is=672bf3cb&hm=d8b79371b0b4c5068e4111a6fe9903d04f7e6dbaf349741b0e08c026d1e365ab&",
      filamentType: "PLA",
      layerHeight: 0.2,
      printProgress: 65,
      layerProgress: 42,
      totalLayers: 100,
      estimatedTimeLeft: "45m",
      stlUrl:
        "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/refs/heads/main/2.0/Box/glTF/Box.gltf",
      isPrinting: true,
    },
    {
      name: "Creeper",
      type: "P1S",
      hotendTemp: 200,
      bedTemp: 55,
      printTime: "2h 15m",
      startedBy: "Jane Smith",
      cameraUrl:
        "https://cdn.discordapp.com/attachments/1303822106848526346/1303855215384199290/p1s_2.gif?ex=672d454b&is=672bf3cb&hm=31762e2a6fe0791544e63317498c59068a6de241198524b2a896c0868f4eaa24&",
      filamentType: "PETG",
      layerHeight: 0.15,
      printProgress: 42,
      layerProgress: 105,
      totalLayers: 250,
      estimatedTimeLeft: "3h 10m",
      isPrinting: true,
    },
    {
      name: "Speedy",
      type: "A1",
      hotendTemp: 180,
      bedTemp: 50,
      printTime: "45m",
      startedBy: "Bob Johnson",
      cameraUrl:
        "https://cdn.discordapp.com/attachments/1303822106848526346/1303855214499205191/a1.gif?ex=672d454b&is=672bf3cb&hm=fc2079b9bb55fae961a4510539e97f5c01f5a04c71968197d405f9597265aef6&",
      filamentType: "ABS",
      layerHeight: 0.1,
      printProgress: 80,
      layerProgress: 160,
      totalLayers: 200,
      estimatedTimeLeft: "15m",
      isPrinting: true,
    },
  ]);

  const [newPrinterName, setNewPrinterName] = useState("");
  const [newPrinterType, setNewPrinterType] = useState("");

  const handleAddPrinter = () => {
    if (newPrinterName && newPrinterType) {
      const newPrinter: Printer = {
        name: newPrinterName,
        type: newPrinterType,
        hotendTemp: 0,
        bedTemp: 0,
        printTime: "0m",
        startedBy: "",
        cameraUrl: "/placeholder.svg?height=200&width=320",
        filamentType: "",
        layerHeight: 0,
        printProgress: 0,
        layerProgress: 0,
        totalLayers: 0,
        estimatedTimeLeft: "0m",
        isPrinting: false,
      };
      setPrinters([...printers, newPrinter]);
      setNewPrinterName("");
      setNewPrinterType("");
    }
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
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <ScrollArea>
            <div
              style={{ marginTop: "25px" }}
              className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            >
              {printers.map((printer, index) => (
                <PrinterInfoCard
                  key={index}
                  printerName={printer.name}
                  printerType={printer.type}
                  hotendTemp={printer.hotendTemp}
                  bedTemp={printer.bedTemp}
                  printTime={printer.printTime}
                  startedBy={printer.startedBy}
                  cameraUrl={printer.cameraUrl}
                  filamentType={printer.filamentType}
                  layerHeight={printer.layerHeight}
                  printProgress={printer.printProgress}
                  layerProgress={printer.layerProgress}
                  totalLayers={printer.totalLayers}
                  estimatedTimeLeft={printer.estimatedTimeLeft}
                  stlUrl={printer.stlUrl}
                  isPrinting={printer.isPrinting}
                  onStopPrint={() => {
                    // Handle stop print logic here
                    console.log(`Stopping print for ${printer.name}`);
                  }}
                  onHotendTempChange={(temp) => {
                    // Handle hotend temperature change
                    console.log(
                      `New hotend temperature for ${printer.name}:`,
                      temp
                    );
                  }}
                  onBedTempChange={(temp) => {
                    // Handle bed temperature change
                    console.log(
                      `New bed temperature for ${printer.name}:`,
                      temp
                    );
                  }}
                  onLayerHeightChange={(height) => {
                    // Handle layer height change
                    console.log(
                      `New layer height for ${printer.name}:`,
                      height
                    );
                  }}
                  onFilamentTypeChange={(type) => {
                    // Handle filament type change
                    console.log(`New filament type for ${printer.name}:`, type);
                  }}
                  onPrintSpeedChange={(speed) => {
                    // Handle print speed change
                    console.log(`New print speed for ${printer.name}:`, speed);
                  }}
                />
              ))}
            </div>
          </ScrollArea>
          <Separator className="my-4" />
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto">
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
                <Button onClick={handleAddPrinter}>Add Printer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Page;
