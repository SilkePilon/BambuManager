// @ts-nocheck

"use client";

import React, { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  PlusCircle,
  HelpCircle,
  Settings,
  Upload,
  Play,
  Pause,
  RotateCcw,
  Printer,
  Zap,
  AlertTriangle,
  BarChart3,
  ChevronRight,
  Thermometer,
  Gauge,
  Layers,
} from "lucide-react";

interface Printer {
  id: string;
  printerName: string;
  printerType: string;
  printerStatus: "printing" | "idle" | "completed" | "error";
  printProgress: number;
  currentGcode: string | null;
  hotendTemp: number;
  bedTemp: number;
  filamentType: string;
  estimatedTimeLeft: string;
  totalLayers: number;
  currentLayer: number;
  printSpeed: number;
  layerHeight: number;
}

// ... (keep the AddPrinterDialog component as it was)

// Main PrintFarmControlPage Component
export default function PrintFarmControlPage() {
  const [printers, setPrinters] = useState<Printer[]>([
    {
      id: "1",
      printerName: "Ender 3 Pro",
      printerType: "FDM",
      printerStatus: "printing",
      printProgress: 35,
      currentGcode: "part1.gcode",
      hotendTemp: 200,
      bedTemp: 60,
      filamentType: "PLA",
      estimatedTimeLeft: "2h 15m",
      totalLayers: 100,
      currentLayer: 35,
      printSpeed: 50,
      layerHeight: 0.2,
    },
    {
      id: "2",
      printerName: "Prusa i3 MK3S+",
      printerType: "FDM",
      printerStatus: "idle",
      printProgress: 0,
      currentGcode: null,
      hotendTemp: 0,
      bedTemp: 0,
      filamentType: "PETG",
      estimatedTimeLeft: "0h 0m",
      totalLayers: 0,
      currentLayer: 0,
      printSpeed: 60,
      layerHeight: 0.15,
    },
    {
      id: "3",
      printerName: "Elegoo Mars 2 Pro",
      printerType: "Resin",
      printerStatus: "completed",
      printProgress: 100,
      currentGcode: "figurine.gcode",
      hotendTemp: 0,
      bedTemp: 0,
      filamentType: "Standard Resin",
      estimatedTimeLeft: "0h 0m",
      totalLayers: 750,
      currentLayer: 750,
      printSpeed: 30,
      layerHeight: 0.05,
    },
    {
      id: "4",
      printerName: "Creality CR-10",
      printerType: "FDM",
      printerStatus: "error",
      printProgress: 78,
      currentGcode: "large_vase.gcode",
      hotendTemp: 210,
      bedTemp: 70,
      filamentType: "ABS",
      estimatedTimeLeft: "1h 45m",
      totalLayers: 400,
      currentLayer: 312,
      printSpeed: 40,
      layerHeight: 0.3,
    },
  ]);
  const [masterPrinter, setMasterPrinter] = useState<string | null>(null);
  const [gcodeFiles, setGcodeFiles] = useState<File[]>([]);
  const [showAddPrinterDialog, setShowAddPrinterDialog] = useState(false);
  const [autoDistribute, setAutoDistribute] = useState(false);
  const [temperatureThreshold, setTemperatureThreshold] = useState(50);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const handleAddPrinter = (printerName: string, printerType: string) => {
    const newPrinter: Printer = {
      id: (printers.length + 1).toString(),
      printerName,
      printerType,
      printerStatus: "idle",
      printProgress: 0,
      currentGcode: null,
      hotendTemp: 0,
      bedTemp: 0,
      filamentType: "",
      estimatedTimeLeft: "0h 0m",
      totalLayers: 0,
      currentLayer: 0,
      printSpeed: 50,
      layerHeight: 0.2,
    };
    setPrinters([...printers, newPrinter]);
    setShowAddPrinterDialog(false);
  };

  const handleSetMasterPrinter = (printerId: string) => {
    setMasterPrinter(printerId);
  };

  const handleGcodeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setGcodeFiles(Array.from(event.target.files));
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files) {
      setGcodeFiles(Array.from(event.dataTransfer.files));
    }
  };

  const distributeGcode = () => {
    const updatedPrinters = printers.map((printer, index) => {
      if (printer.printerStatus === "idle" && index < gcodeFiles.length) {
        return {
          ...printer,
          printerStatus: "printing",
          printProgress: 0,
          currentGcode: gcodeFiles[index].name,
          estimatedTimeLeft: "3h 0m", // This would be calculated based on the actual G-code
          totalLayers: 100, // This would be parsed from the G-code
          currentLayer: 0,
        };
      }
      return printer;
    });
    setPrinters(updatedPrinters);
    setGcodeFiles([]);
  };

  const syncWithMaster = () => {
    if (masterPrinter) {
      const master = printers.find((p) => p.id === masterPrinter);
      if (master) {
        const updatedPrinters = printers.map((printer) => {
          if (
            printer.id !== masterPrinter &&
            printer.printerStatus === "idle"
          ) {
            return {
              ...printer,
              printerStatus: "printing",
              printProgress: 0,
              currentGcode: master.currentGcode,
              hotendTemp: master.hotendTemp,
              bedTemp: master.bedTemp,
              filamentType: master.filamentType,
              estimatedTimeLeft: master.estimatedTimeLeft,
              totalLayers: master.totalLayers,
              currentLayer: 0,
              printSpeed: master.printSpeed,
              layerHeight: master.layerHeight,
            };
          }
          return printer;
        });
        setPrinters(updatedPrinters);
      }
    }
  };

  const resetAllPrinters = () => {
    const updatedPrinters = printers.map((printer) => ({
      ...printer,
      printerStatus: "idle",
      printProgress: 0,
      currentGcode: null,
      hotendTemp: 0,
      bedTemp: 0,
      estimatedTimeLeft: "0h 0m",
      totalLayers: 0,
      currentLayer: 0,
    }));
    setPrinters(updatedPrinters);
    setMasterPrinter(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "printing":
        return "bg-blue-500";
      case "completed":
        return "bg-green-500";
      case "idle":
        return "bg-gray-500";
      case "error":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  const updateMasterPrinterSettings = (setting: string, value: number) => {
    if (masterPrinter) {
      const updatedPrinters = printers.map((printer) => {
        if (printer.id === masterPrinter) {
          return { ...printer, [setting]: value };
        }
        return printer;
      });
      setPrinters(updatedPrinters);

      // Propagate changes to other printers
      const otherPrinters = updatedPrinters.map((printer) => {
        if (printer.id !== masterPrinter && printer.printerStatus === "idle") {
          return { ...printer, [setting]: value };
        }
        return printer;
      });
      setPrinters(otherPrinters);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <header className="flex h-16 items-center px-4 border-b">
            <SidebarTrigger />
            <h1 className="ml-4 text-2xl font-bold">
              Advanced Print Farm Control
            </h1>
            <div className="ml-auto flex items-center gap-4">
              <Button variant="outline" size="icon" onClick={() => {}}>
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => {}}>
                <HelpCircle className="h-4 w-4" />
              </Button>
              {/* <AddPrinterButton onClick={() => setShowAddPrinterDialog(true)} /> */}
            </div>
          </header>
          <main className="flex-1 p-6 space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Print Farm Overview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {printers.length}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Total Printers
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {
                          printers.filter((p) => p.printerStatus === "printing")
                            .length
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Printing
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {
                          printers.filter((p) => p.printerStatus === "idle")
                            .length
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">Idle</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">
                        {
                          printers.filter((p) => p.printerStatus === "error")
                            .length
                        }
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Errors
                      </div>
                    </div>
                  </div>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Printer</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Progress</TableHead>
                        <TableHead>Current G-code</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {printers.map((printer) => (
                        <TableRow key={printer.id}>
                          <TableCell>{printer.printerName}</TableCell>
                          <TableCell>
                            <Badge
                              className={`${getStatusColor(
                                printer.printerStatus
                              )} text-white`}
                            >
                              {printer.printerStatus}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <Progress
                                value={printer.printProgress}
                                className="w-[60px] mr-2"
                              />
                              <span>{printer.printProgress}%</span>
                            </div>
                          </TableCell>
                          <TableCell>{printer.currentGcode || "N/A"}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Farm Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[300px] flex items-center justify-center">
                    <BarChart3 className="h-32 w-32 text-muted-foreground" />
                    <div className="ml-4 text-center">
                      <p className="text-lg font-semibold">
                        Statistics Placeholder
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Detailed farm statistics would be displayed here
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Farm Control</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="master-printer">Master Printer</Label>
                      <Select
                        onValueChange={handleSetMasterPrinter}
                        value={masterPrinter || undefined}
                      >
                        <SelectTrigger id="master-printer">
                          <SelectValue placeholder="Select master printer" />
                        </SelectTrigger>
                        <SelectContent>
                          {printers.map((printer) => (
                            <SelectItem key={printer.id} value={printer.id}>
                              {printer.printerName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="temperature-threshold">
                        Temperature Threshold (°C)
                      </Label>
                      <Input
                        id="temperature-threshold"
                        type="number"
                        value={temperatureThreshold}
                        onChange={(e) =>
                          setTemperatureThreshold(Number(e.target.value))
                        }
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="auto-distribute"
                        checked={autoDistribute}
                        onCheckedChange={setAutoDistribute}
                      />
                      <Label htmlFor="auto-distribute">
                        Auto-distribute G-code
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="notifications"
                        checked={notificationsEnabled}
                        onCheckedChange={setNotificationsEnabled}
                      />
                      <Label htmlFor="notifications">
                        Enable Notifications
                      </Label>
                    </div>
                  </div>
                  <div
                    className="border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center"
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                  >
                    <Upload className="h-12 w-12 text-gray-400 mb-4" />
                    <p className="text-sm text-gray-600 mb-2">
                      Drag and drop G-code files here, or
                    </p>
                    <Input
                      id="gcode-upload"
                      type="file"
                      multiple
                      onChange={handleGcodeUpload}
                      className="max-w-xs"
                    />
                    {gcodeFiles.length > 0 && (
                      <div className="mt-4">
                        <p className="font-semibold">Uploaded Files:</p>
                        <ul className="list-disc list-inside">
                          {gcodeFiles.map((file, index) => (
                            <li key={index}>{file.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
                <div className="mt-6 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Button
                      onClick={distributeGcode}
                      disabled={gcodeFiles.length === 0}
                      className="flex-1 sm:flex-none"
                    >
                      <Upload className="mr-2 h-4 w-4" />
                      Distribute G-code
                    </Button>
                    <Button
                      onClick={syncWithMaster}
                      disabled={!masterPrinter}
                      className="flex-1 sm:flex-none"
                    >
                      <Zap className="mr-2 h-4 w-4" />
                      Sync with Master
                    </Button>
                    <Button
                      variant="outline"
                      onClick={resetAllPrinters}
                      className="flex-1 sm:flex-none"
                    >
                      <RotateCcw className="mr-2 h-4 w-4" />
                      Reset All Printers
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" className="flex-1 sm:flex-none">
                      <Pause className="mr-2 h-4 w-4" />
                      Pause All Prints
                    </Button>
                    <Button variant="outline" className="flex-1 sm:flex-none">
                      <Play className="mr-2 h-4 w-4" />
                      Resume All Prints
                    </Button>
                    <Button variant="outline" className="flex-1 sm:flex-none">
                      <AlertTriangle className="mr-2 h-4 w-4" />
                      Clear All Errors
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Master Printer Settings</CardTitle>
              </CardHeader>
              <CardContent>
                {masterPrinter ? (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="master-hotend-temp">
                        Hotend Temperature (°C)
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="master-hotend-temp"
                          type="number"
                          value={
                            printers.find((p) => p.id === masterPrinter)
                              ?.hotendTemp || 0
                          }
                          onChange={(e) =>
                            updateMasterPrinterSettings(
                              "hotendTemp",
                              Number(e.target.value)
                            )
                          }
                        />
                        <Thermometer className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="master-bed-temp">
                        Bed Temperature (°C)
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="master-bed-temp"
                          type="number"
                          value={
                            printers.find((p) => p.id === masterPrinter)
                              ?.bedTemp || 0
                          }
                          onChange={(e) =>
                            updateMasterPrinterSettings(
                              "bedTemp",
                              Number(e.target.value)
                            )
                          }
                        />
                        <Thermometer className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="master-print-speed">
                        Print Speed (mm/s)
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="master-print-speed"
                          type="number"
                          value={
                            printers.find((p) => p.id === masterPrinter)
                              ?.printSpeed || 0
                          }
                          onChange={(e) =>
                            updateMasterPrinterSettings(
                              "printSpeed",
                              Number(e.target.value)
                            )
                          }
                        />
                        <Gauge className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="master-layer-height">
                        Layer Height (mm)
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="master-layer-height"
                          type="number"
                          step="0.05"
                          min="0.05"
                          max="0.5"
                          value={
                            printers.find((p) => p.id === masterPrinter)
                              ?.layerHeight || 0
                          }
                          onChange={(e) =>
                            updateMasterPrinterSettings(
                              "layerHeight",
                              Number(e.target.value)
                            )
                          }
                        />
                        <Layers className="h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Changes to these settings will be applied to all idle
                      printers in the farm.
                    </p>
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground">
                    Please select a Master Printer to configure settings.
                  </p>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Printer Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {printers.map((printer) => (
                    <Card key={printer.id} className="relative overflow-hidden">
                      <div
                        className={`absolute top-0 left-0 w-2 h-full ${getStatusColor(
                          printer.printerStatus
                        )}`}
                      />
                      <CardHeader>
                        <CardTitle className="flex justify-between items-center">
                          <span>{printer.printerName}</span>
                          <Badge variant="outline">{printer.printerType}</Badge>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Status:
                            </span>
                            <Badge
                              className={`${getStatusColor(
                                printer.printerStatus
                              )} text-white`}
                            >
                              {printer.printerStatus}
                            </Badge>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-muted-foreground">
                              Progress:
                            </span>
                            <div className="flex items-center">
                              <Progress
                                value={printer.printProgress}
                                className="w-[60px] mr-2"
                              />
                              <span>{printer.printProgress}%</span>
                            </div>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Current G-code:
                            </span>
                            <span>{printer.currentGcode || "N/A"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Hotend Temp:
                            </span>
                            <span>{printer.hotendTemp}°C</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Bed Temp:
                            </span>
                            <span>{printer.bedTemp}°C</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Filament:
                            </span>
                            <span>{printer.filamentType}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Est. Time Left:
                            </span>
                            <span>{printer.estimatedTimeLeft}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-muted-foreground">
                              Layer:
                            </span>
                            <span>
                              {printer.currentLayer} / {printer.totalLayers}
                            </span>
                          </div>
                        </div>
                        <div className="mt-4 flex justify-end">
                          <Button variant="outline" size="sm">
                            Manage
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </SidebarInset>
      {/* <AddPrinterDialog
        open={showAddPrinterDialog}
        onOpenChange={setShowAddPrinterDialog}
        onAddPrinter={handleAddPrinter}
      /> */}
    </SidebarProvider>
  );
}
