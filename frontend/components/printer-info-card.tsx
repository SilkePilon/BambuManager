"use client";

import React from "react";
import Image from "next/image";
import { useState, useEffect, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Printer,
  Thermometer,
  Clock,
  User,
  Info,
  X,
  Box,
  Layers,
  Droplet,
  FastForward,
  Fan,
  Lightbulb,
  Loader2,
  Check,
  ChevronsUpDown,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
  fallback: React.ReactNode;
  onError?: () => void;
}> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error loading 3D model:", error, errorInfo);
    this.props.onError?.();
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} />;
}

interface PrinterInfoCardProps {
  printerName: string;
  printerType: string;
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
  printerStatus: "printing" | "idle" | "completed";
  fanSpeed: number;
  lightOn: boolean;
  onStopPrint: () => void;
  onHotendTempChange: (temp: number) => void;
  onBedTempChange: (temp: number) => void;
  onLayerHeightChange: (height: number) => void;
  onFilamentTypeChange: (type: string) => void;
  onPrintSpeedChange: (speed: string | number) => void;
  onFanSpeedChange: (speed: number) => void;
  onLightToggle: (on: boolean) => void;
  onDownloadTimelapse?: () => void;
}

const filamentOptions = [
  {
    value: "PLA",
    label: "PLA",
    description: "General purpose, easy to print",
    hotendTemp: 200,
    bedTemp: 60,
  },
  {
    value: "ABS",
    label: "ABS",
    description: "Durable, heat-resistant",
    hotendTemp: 230,
    bedTemp: 110,
  },
  {
    value: "PETG",
    label: "PETG",
    description: "Strong, chemical-resistant",
    hotendTemp: 240,
    bedTemp: 80,
  },
  {
    value: "TPU",
    label: "TPU",
    description: "Flexible, impact-resistant",
    hotendTemp: 220,
    bedTemp: 50,
  },
  {
    value: "Nylon",
    label: "Nylon",
    description: "Strong, abrasion-resistant",
    hotendTemp: 250,
    bedTemp: 70,
  },
];

const printSpeedOptions = [
  { value: "ludicrous", label: "Ludicrous", description: "Decreased quality" },
  { value: "sport", label: "Sport", description: "Slightly decreased quality" },
  {
    value: "standard",
    label: "Standard",
    description: "Balanced speed and quality",
  },
  { value: "silent", label: "Silent", description: "Increased quality" },
  { value: "custom", label: "Custom", description: "Set your own speed" },
];

export default function PrinterInfoCard({
  printerName = "Stalker",
  printerType = "P1S",
  hotendTemp = 200,
  bedTemp = 60,
  printTime = "2h 45m",
  startedBy = "John Doe",
  cameraUrl = "/placeholder.svg?height=200&width=320",
  filamentType = "PLA",
  layerHeight = 0.2,
  printProgress = 65,
  layerProgress = 42,
  totalLayers = 100,
  estimatedTimeLeft = "1h 15m",
  stlUrl,
  printerStatus = "idle",
  fanSpeed = 50,
  lightOn = false,
  onStopPrint = () => console.log("Stop print clicked"),
  onHotendTempChange = (temp: number) =>
    console.log("Hotend temp changed:", temp),
  onBedTempChange = (temp: number) => console.log("Bed temp changed:", temp),
  onLayerHeightChange = (height: number) =>
    console.log("Layer height changed:", height),
  onFilamentTypeChange = (type: string) =>
    console.log("Filament type changed:", type),
  onPrintSpeedChange = (speed: string | number) =>
    console.log("Print speed changed:", speed),
  onFanSpeedChange = (speed: number) =>
    console.log("Fan speed changed:", speed),
  onLightToggle = (on: boolean) => console.log("Light toggled:", on),
  onDownloadTimelapse = () => console.log("Download timelapse clicked"),
}: PrinterInfoCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [modelError, setModelError] = useState(false);
  const [customSpeed, setCustomSpeed] = useState<number | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showUnsavedChangesAlert, setShowUnsavedChangesAlert] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const [tempHotendTemp, setTempHotendTemp] = useState(hotendTemp);
  const [tempBedTemp, setTempBedTemp] = useState(bedTemp);
  const [tempLayerHeight, setTempLayerHeight] = useState(layerHeight);
  const [tempFilamentType, setTempFilamentType] = useState(filamentType);
  const [tempPrintSpeed, setTempPrintSpeed] = useState<string | number>(
    "standard"
  );
  const [tempFanSpeed, setTempFanSpeed] = useState(fanSpeed);
  const [tempLightOn, setTempLightOn] = useState(lightOn);

  useEffect(() => {
    const hasChanges =
      tempHotendTemp !== hotendTemp ||
      tempBedTemp !== bedTemp ||
      tempLayerHeight !== layerHeight ||
      tempFilamentType !== filamentType ||
      tempPrintSpeed !== "standard" ||
      tempFanSpeed !== fanSpeed ||
      tempLightOn !== lightOn;
    setUnsavedChanges(hasChanges);
  }, [
    tempHotendTemp,
    tempBedTemp,
    tempLayerHeight,
    tempFilamentType,
    tempPrintSpeed,
    tempFanSpeed,
    tempLightOn,
    hotendTemp,
    bedTemp,
    layerHeight,
    filamentType,
    fanSpeed,
    lightOn,
  ]);

  const handlePrintSpeedChange = (value: string) => {
    if (value === "custom") {
      setTempPrintSpeed(100);
      setCustomSpeed(100);
    } else {
      setTempPrintSpeed(value);
      setCustomSpeed(null);
    }
  };

  const handleApplyChanges = () => {
    setIsApplying(true);
    setTimeout(() => {
      onHotendTempChange(tempHotendTemp);
      onBedTempChange(tempBedTemp);
      onLayerHeightChange(tempLayerHeight);
      onFilamentTypeChange(tempFilamentType);
      onPrintSpeedChange(tempPrintSpeed);
      onFanSpeedChange(tempFanSpeed);
      onLightToggle(tempLightOn);
      setUnsavedChanges(false);
      setIsApplying(false);
    }, 2000);
  };

  const handleCloseDetails = () => {
    if (unsavedChanges) {
      setShowUnsavedChangesAlert(true);
    } else {
      setShowDetails(false);
    }
  };

  const handleConfirmClose = () => {
    setShowUnsavedChangesAlert(false);
    setShowDetails(false);
    // Reset temporary values
    setTempHotendTemp(hotendTemp);
    setTempBedTemp(bedTemp);
    setTempLayerHeight(layerHeight);
    setTempFilamentType(filamentType);
    setTempPrintSpeed("standard");
    setCustomSpeed(null);
    setTempFanSpeed(fanSpeed);
    setTempLightOn(lightOn);
  };

  const handleFilamentChange = (value: string) => {
    const selectedFilament = filamentOptions.find((f) => f.value === value);
    if (selectedFilament) {
      setTempFilamentType(value);
      setTempHotendTemp(selectedFilament.hotendTemp);
      setTempBedTemp(selectedFilament.bedTemp);
    }
  };

  const getBorderColor = () => {
    switch (printerStatus) {
      case "printing":
        return "border-purple-500 border-4";
      case "idle":
        return "border-orange-500 border-4";
      case "completed":
        return "border-green-500 border-4";
      default:
        return "border-gray-200 border-4";
    }
  };

  const getBackgroundColor = () => {
    switch (printerStatus) {
      case "printing":
        return "bg-purple-500 hover:bg-purple-800";
      case "idle":
        return "bg-orange-500 hover:bg-orange-800";
      case "completed":
        return "bg-green-500 hover:bg-green-800";
      default:
        return "bg-gray-200 hover:bg-gray-800";
    }
  };

  return (
    <>
      <Card
        className={`w-full max-w-sm rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg border-2 ${getBorderColor()}`}
      >
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg font-bold">
              <Printer className="h-5 w-5" />
              {printerType}
            </CardTitle>
            <Badge className={`text-xs ${getBackgroundColor()} text-white`}>
              <strong>
                {printerStatus === "printing"
                  ? "Printing"
                  : printerStatus === "completed"
                  ? "Completed"
                  : "Idle"}
              </strong>
            </Badge>
          </div>
          <div className="text-center font-semibold mt-2">{printerName}</div>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="relative aspect-video overflow-hidden rounded-md">
            {showModel && stlUrl ? (
              <Suspense
                fallback={
                  <div className="h-full w-full bg-muted flex items-center justify-center">
                    Loading 3D model...
                  </div>
                }
              >
                <ErrorBoundary
                  fallback={
                    <div className="h-full w-full bg-muted flex items-center justify-center">
                      Error loading 3D model
                    </div>
                  }
                  onError={() => setModelError(true)}
                >
                  <Canvas>
                    <ambientLight intensity={0.5} />
                    <spotLight
                      position={[10, 10, 10]}
                      angle={0.15}
                      penumbra={1}
                    />
                    <Model url={stlUrl} />
                    <OrbitControls />
                  </Canvas>
                </ErrorBoundary>
              </Suspense>
            ) : (
              <>
                <Image
                  src={cameraUrl}
                  alt="Printer live view"
                  layout="fill"
                  objectFit="cover"
                />
                <Badge
                  variant={"secondary"}
                  className="absolute bottom-2 right-2"
                >
                  Live
                </Badge>
              </>
            )}
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex flex-col items-center justify-center">
              <Thermometer className="h-5 w-5 text-red-500" />
              <span className="mt-1 font-semibold">{hotendTemp}°C</span>
              <span className="text-xs text-muted-foreground">Hotend</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Thermometer className="h-5 w-5 text-blue-500" />
              <span className="mt-1 font-semibold">{bedTemp}°C</span>
              <span className="text-xs text-muted-foreground">Bed</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Clock className="h-5 w-5 text-green-500" />
              <span className="mt-1 font-semibold">{printTime}</span>
              <span className="text-xs text-muted-foreground">Print Time</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <User className="h-4 w-4" />
              Started by
            </span>
            <span>{startedBy}</span>
          </div>
          <div
            className={`grid gap-2 ${
              !stlUrl || modelError ? "grid-cols-2" : "grid-cols-3"
            }`}
          >
            <Button
              onClick={() =>
                printerStatus === "completed"
                  ? onDownloadTimelapse()
                  : setShowDetails(true)
              }
              className={`flex-1 ${!stlUrl || modelError ? "col-span-1" : ""}`}
              variant={"secondary"}
            >
              {printerStatus === "completed" ? (
                <>
                  <Download className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Download Timelapse</span>
                </>
              ) : (
                <>
                  <Info className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Details</span>
                </>
              )}
            </Button>
            {stlUrl && !modelError && (
              <Button
                onClick={() => setShowModel(!showModel)}
                variant={showModel ? "secondary" : "outline"}
                className="flex-1"
              >
                <Box className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">
                  {showModel ? "Live" : "3D"}
                </span>
              </Button>
            )}
            {printerStatus === "printing" && (
              <Button
                variant="destructive"
                onClick={onStopPrint}
                className="flex-1"
              >
                <X className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Cancel</span>
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Print Details for {printerType}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-red-500" />
                  <span>Hotend Temperature:</span>
                  <Input
                    type="number"
                    value={tempHotendTemp}
                    onChange={(e) => setTempHotendTemp(Number(e.target.value))}
                    className="w-20"
                  />
                  <span>°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="h-5 w-5 text-blue-500" />
                  <span>Bed Temperature:</span>
                  <Input
                    type="number"
                    value={tempBedTemp}
                    onChange={(e) => setTempBedTemp(Number(e.target.value))}
                    className="w-20"
                  />
                  <span>°C</span>
                </div>
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-green-500" />
                  <span>Layer Height:</span>
                  <Input
                    type="number"
                    value={tempLayerHeight}
                    onChange={(e) => setTempLayerHeight(Number(e.target.value))}
                    className="w-20"
                    step="0.01"
                  />
                  <span>mm</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-purple-500" />
                  <span>Filament Type:</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-[200px] justify-between"
                      >
                        {tempFilamentType
                          ? filamentOptions.find(
                              (filament) => filament.value === tempFilamentType
                            )?.label
                          : "Select filament..."}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search filament..."
                          className="h-9"
                        />
                        <CommandList className="max-h-[200px] overflow-y-auto">
                          <CommandEmpty>No filament found.</CommandEmpty>
                          <CommandGroup>
                            {filamentOptions.map((filament) => (
                              <CommandItem
                                key={filament.value}
                                value={filament.value}
                                onSelect={(value) => {
                                  handleFilamentChange(value);
                                  setShowDetails(false);
                                }}
                              >
                                <div>
                                  {filament.label}
                                  <p className="text-sm text-gray-500">
                                    {filament.description}
                                  </p>
                                </div>
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    tempFilamentType === filament.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="flex items-center gap-2">
                  <FastForward className="h-5 w-5 text-yellow-500" />
                  <span>Print Speed:</span>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        className="w-[200px] justify-between"
                      >
                        {tempPrintSpeed.toString()
                          ? printSpeedOptions.find(
                              (speed) =>
                                speed.value === tempPrintSpeed.toString()
                            )?.label
                          : "Select speed..."}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search speed..."
                          className="h-9"
                        />
                        <CommandList className="max-h-[200px] overflow-y-auto">
                          <CommandEmpty>No speed found.</CommandEmpty>
                          <CommandGroup>
                            {printSpeedOptions.map((speed) => (
                              <CommandItem
                                key={speed.value}
                                value={speed.value}
                                onSelect={(value) => {
                                  handlePrintSpeedChange(value);
                                  setShowDetails(false);
                                }}
                              >
                                <div>
                                  {speed.label}
                                  <p className="text-sm text-gray-500">
                                    {speed.description}
                                  </p>
                                </div>
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    tempPrintSpeed.toString() === speed.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  {customSpeed !== null && (
                    <Input
                      type="number"
                      value={customSpeed}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setCustomSpeed(value);
                        setTempPrintSpeed(value);
                      }}
                      className="w-20 ml-2"
                    />
                  )}
                  {customSpeed !== null && <span>%</span>}
                </div>
                <div className="flex items-center gap-2">
                  <Fan className="h-5 w-5 text-cyan-500" />
                  <span>Fan Speed:</span>
                  <Input
                    type="number"
                    value={tempFanSpeed}
                    onChange={(e) => setTempFanSpeed(Number(e.target.value))}
                    className="w-20"
                    min="0"
                    max="100"
                  />
                  <span>%</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-500" />
                  <span>Printer Light:</span>
                  <Button
                    variant={tempLightOn ? "default" : "outline"}
                    onClick={() => setTempLightOn(!tempLightOn)}
                  >
                    {tempLightOn ? "On" : "Off"}
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-500" />
                  <span>Print Time:</span>
                  <span className="font-semibold">{printTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-teal-500" />
                  <span>Estimated Time Left:</span>
                  <span className="font-semibold">{estimatedTimeLeft}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span>Started by:</span>
                  <span className="font-semibold">{startedBy}</span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-secondary rounded-md p-2 flex justify-center items-center">
                  <div className="relative aspect-video w-full max-w-full rounded-md overflow-hidden">
                    <Image
                      src={cameraUrl}
                      alt="Printer live view"
                      fill
                      className="rounded-md object-contain"
                    />
                  </div>
                </div>
                <div className="bg-secondary rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Print Progress</span>
                    <span className="font-semibold">{printProgress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${printProgress}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Layer Progress</span>
                    <span className="font-semibold">
                      {layerProgress} / {totalLayers}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{
                        width: `${(layerProgress / totalLayers) * 100}%`,
                      }}
                    ></div>
                  </div>
                </div>
                {printerStatus === "completed" && (
                  <Button onClick={onDownloadTimelapse} className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Download Timelapse
                  </Button>
                )}
              </div>
            </div>
          </DialogDescription>
          <DialogFooter>
            {unsavedChanges && (
              <Button
                onClick={handleApplyChanges}
                className="mr-2 bg-green-500 hover:bg-green-600"
                variant={"secondary"}
                // disabled={printerStatus === "printing" || isApplying}
              >
                {isApplying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                ) : (
                  <strong>
                    {printerStatus === "printing"
                      ? "Apply While Printing"
                      : "Apply Changes"}
                  </strong>
                )}
              </Button>
            )}
            <Button
              onClick={handleCloseDetails}
              variant={unsavedChanges ? "outline" : "secondary"}
            >
              <strong>{unsavedChanges ? "Cancel" : "Close"}</strong>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={showUnsavedChangesAlert}
        onOpenChange={setShowUnsavedChangesAlert}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unsaved Changes</AlertDialogTitle>
            <AlertDialogDescription>
              You have unsaved changes. Are you sure you want to close without
              applying these changes?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => setShowUnsavedChangesAlert(false)}
            >
              Go Back
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={handleConfirmClose}
                className="bg-red-500 hover:bg-red-600"
                variant={"destructive"}
              >
                <strong>Close Without Saving</strong>
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
