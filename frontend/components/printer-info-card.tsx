"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
  Droplet,
  FastForward,
  Fan,
  Lightbulb,
  Loader2,
  Check,
  ChevronsUpDown,
  Download,
  Play,
  Upload,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface PrinterInfoCardProps {
  printerName: string;
  printerType: string;
  hotendTemp: number;
  bedTemp: number;
  printTime: string;
  startedBy: string;
  cameraUrl: string;
  fallbackImageUrl: string;
  filamentType: string;
  layerHeight: number;
  printProgress: number;
  layerProgress: number;
  totalLayers: number;
  estimatedTimeLeft: string;
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
  onUploadGcode: (file: File) => Promise<void>;
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
  printerName = "Printer",
  printerType = "Unknown",
  hotendTemp = 0,
  bedTemp = 0,
  printTime = "0h 0m",
  startedBy = "Unknown",
  cameraUrl = "/placeholder.svg?height=200&width=320",
  fallbackImageUrl = "/placeholder.svg?height=200&width=320",
  filamentType = "PLA",
  layerHeight = 0.2,
  printProgress = 0,
  layerProgress = 0,
  totalLayers = 0,
  estimatedTimeLeft = "0h 0m",
  printerStatus = "idle",
  fanSpeed = 0,
  lightOn = false,
  onStopPrint = () => {},
  onHotendTempChange = () => {},
  onBedTempChange = () => {},
  onLayerHeightChange = () => {},
  onFilamentTypeChange = () => {},
  onPrintSpeedChange = () => {},
  onFanSpeedChange = () => {},
  onLightToggle = () => {},
  onDownloadTimelapse = () => {},
  onUploadGcode = async () => {},
}: PrinterInfoCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const [customSpeed, setCustomSpeed] = useState<number | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [showUnsavedChangesAlert, setShowUnsavedChangesAlert] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [showStartPrintDialog, setShowStartPrintDialog] = useState(false);
  const [showCancelPrintDialog, setShowCancelPrintDialog] = useState(false);
  const [liveViewError, setLiveViewError] = useState(false);
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});

  const [tempHotendTemp, setTempHotendTemp] = useState(hotendTemp);
  const [tempBedTemp, setTempBedTemp] = useState(bedTemp);
  const [tempLayerHeight, setTempLayerHeight] = useState(layerHeight);
  const [tempFilamentType, setTempFilamentType] = useState(filamentType);
  const [tempPrintSpeed, setTempPrintSpeed] = useState<string | number>(
    "standard"
  );
  const [tempFanSpeed, setTempFanSpeed] = useState(fanSpeed);
  const [tempLightOn, setTempLightOn] = useState(lightOn);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

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
        return "border-purple-500";
      case "idle":
        return "border-orange-500";
      case "completed":
        return "border-green-500";
      default:
        return "border-gray-200";
    }
  };

  const getBackgroundColor = () => {
    switch (printerStatus) {
      case "printing":
        return "bg-purple-500 hover:bg-purple-600";
      case "idle":
        return "bg-orange-500 hover:bg-orange-600";
      case "completed":
        return "bg-green-500 hover:bg-green-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };

  const handleStartPrint = async () => {
    setIsLoading({ startPrint: true });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    if (uploadedFile) {
      await onUploadGcode(uploadedFile);
    }
    setShowStartPrintDialog(false);
    setIsLoading({ startPrint: false });
  };

  const handleSetIdle = async () => {
    setIsLoading({ setIdle: true });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Setting printer to idle");
    setIsLoading({ setIdle: false });
  };

  const handleButtonClick = async (action: string, callback: () => void) => {
    setIsLoading({ [action]: true });
    await new Promise((resolve) => setTimeout(resolve, 2000));
    callback();
    setIsLoading({ [action]: false });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card
          className={`w-full max-w-sm rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg ${getBorderColor()} border-4`}
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
              {liveViewError ? (
                <Image
                  src={fallbackImageUrl}
                  alt="Printer fallback view"
                  layout="fill"
                  objectFit="cover"
                />
              ) : (
                <Image
                  src={cameraUrl}
                  alt="Printer live view"
                  layout="fill"
                  objectFit="cover"
                />
              )}
              <div className="absolute bottom-2 right-2 flex flex-col gap-2">
                <Badge variant="secondary">
                  <span className="">
                    {liveViewError ? "Error loading live view" : "Live"}
                  </span>
                </Badge>
              </div>
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
                <span className="text-xs text-muted-foreground">
                  Print Time
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Started by
              </span>
              <span>{startedBy}</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {printerStatus === "completed" ? (
                <>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() =>
                        handleButtonClick(
                          "downloadTimelapse",
                          onDownloadTimelapse
                        )
                      }
                      className="flex items-center justify-center w-full"
                      variant="secondary"
                      disabled={isLoading["downloadTimelapse"]}
                    >
                      {isLoading["downloadTimelapse"] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Download className="h-4 w-4 mr-2" />
                          <span className="truncate">
                            <strong>Timelapse</strong>
                          </span>
                        </>
                      )}
                    </Button>
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() =>
                        handleButtonClick("setIdle", handleSetIdle)
                      }
                      className="flex items-center justify-center w-full"
                      variant="secondary"
                      disabled={isLoading["setIdle"]}
                    >
                      {isLoading["setIdle"] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          <span className="truncate">
                            <strong>Set Idle</strong>
                          </span>
                        </>
                      )}
                    </Button>
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.95 }} className="col-span-2">
                    <Button
                      onClick={() =>
                        handleButtonClick("showStartPrintDialog", () =>
                          setShowStartPrintDialog(true)
                        )
                      }
                      className="flex items-center justify-center w-full"
                      variant="secondary"
                      disabled={isLoading["showStartPrintDialog"]}
                    >
                      {isLoading["showStartPrintDialog"] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Play className="h-4 w-4 mr-2" />
                          <span className="truncate">
                            <strong>Start New Print</strong>
                          </span>
                        </>
                      )}
                    </Button>
                  </motion.div>
                </>
              ) : (
                <>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() =>
                        handleButtonClick("showDetails", () =>
                          setShowDetails(true)
                        )
                      }
                      className="flex items-center justify-center w-full"
                      variant="secondary"
                      disabled={isLoading["showDetails"]}
                    >
                      {isLoading["showDetails"] ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <>
                          <Info className="h-4 w-4 mr-2" />
                          <span className="truncate">
                            <strong>Details</strong>
                          </span>
                        </>
                      )}
                    </Button>
                  </motion.div>
                  {printerStatus === "printing" ? (
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="destructive"
                        onClick={() => setShowCancelPrintDialog(true)}
                        className="flex items-center justify-center w-full"
                        disabled={isLoading["stopPrint"]}
                      >
                        {isLoading["stopPrint"] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <X className="h-4 w-4 mr-2" />
                            <span className="truncate">
                              <strong>Cancel</strong>
                            </span>
                          </>
                        )}
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() =>
                          handleButtonClick("showStartPrintDialog", () =>
                            setShowStartPrintDialog(true)
                          )
                        }
                        className="flex items-center justify-center w-full"
                        variant="secondary"
                        disabled={isLoading["showStartPrintDialog"]}
                      >
                        {isLoading["showStartPrintDialog"] ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            <span className="truncate">
                              <strong>Start Print</strong>
                            </span>
                          </>
                        )}
                      </Button>
                    </motion.div>
                  )}
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Print Details for {printerType}</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-red-500" />
                    <span>Hotend Temperature:</span>
                    <Input
                      type="number"
                      value={tempHotendTemp}
                      onChange={(e) =>
                        setTempHotendTemp(Number(e.target.value))
                      }
                      className="w-20"
                    />
                    <span>°C</span>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
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
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <div className="flex items-center gap-2">
                    <Droplet className="h-5 w-5 text-purple-500" />
                    <span>Filament Type:</span>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          className="w-[200px] justify-between"
                          disabled={printerStatus === "printing"}
                        >
                          {tempFilamentType
                            ? filamentOptions.find(
                                (filament) =>
                                  filament.value === tempFilamentType
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
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
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
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
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
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    <span>Printer Light:</span>
                    <Button
                      variant={tempLightOn ? "default" : "outline"}
                      onClick={() => setTempLightOn(!tempLightOn)}
                    >
                      <strong>{tempLightOn ? "On" : "Off"}</strong>
                    </Button>
                  </div>
                </motion.div>
              </div>
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <div className="bg-secondary rounded-md p-2 flex justify-center items-center">
                    <div className="relative aspect-video w-full max-w-full rounded-md overflow-hidden">
                      {liveViewError ? (
                        <Image
                          src={fallbackImageUrl}
                          alt="Printer fallback view"
                          fill
                          className="rounded-md object-contain"
                        />
                      ) : (
                        <Image
                          src={cameraUrl}
                          alt="Printer live view"
                          fill
                          className="rounded-md object-contain"
                        />
                      )}
                    </div>
                  </div>
                </motion.div>
                {printerStatus === "printing" && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <div className="bg-secondary rounded-md p-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">Print Progress</span>
                        <span className="font-semibold">{printProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 mb-4">
                        <motion.div
                          className="bg-blue-600 h-2.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${printProgress}%` }}
                          transition={{ duration: 0.5 }}
                        ></motion.div>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold">Layer Progress</span>
                        <span className="font-semibold">
                          {layerProgress} / {totalLayers}
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                        <motion.div
                          className="bg-green-600 h-2.5 rounded-full"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${(layerProgress / totalLayers) * 100}%`,
                          }}
                          transition={{ duration: 0.5 }}
                        ></motion.div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </DialogDescription>
          <DialogFooter>
            {unsavedChanges && (
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={handleApplyChanges}
                  className="mr-2 bg-green-500 hover:bg-green-600"
                  variant="secondary"
                >
                  {isApplying ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      <strong>Please wait</strong>
                    </>
                  ) : (
                    <strong>
                      {printerStatus === "printing"
                        ? "Apply While Printing"
                        : "Apply Changes"}
                    </strong>
                  )}
                </Button>
              </motion.div>
            )}
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                onClick={handleCloseDetails}
                variant={unsavedChanges ? "outline" : "secondary"}
              >
                <strong>{unsavedChanges ? "Cancel" : "Close"}</strong>
              </Button>
            </motion.div>
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
              <strong>Go Back</strong>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={handleConfirmClose}
                className="bg-red-500 hover:bg-red-600"
                variant="destructive"
              >
                <strong>Close Without Saving</strong>
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog
        open={showStartPrintDialog}
        onOpenChange={setShowStartPrintDialog}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Start New Print</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
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
                                (filament) =>
                                  filament.value === tempFilamentType
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
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
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
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
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
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-500" />
                    <span>Printer Light:</span>
                    <Button
                      variant={tempLightOn ? "default" : "outline"}
                      onClick={() => setTempLightOn(!tempLightOn)}
                    >
                      <strong>{tempLightOn ? "On" : "Off"}</strong>
                    </Button>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center gap-2">
                    <Thermometer className="h-5 w-5 text-red-500" />
                    <span>Hotend Temperature:</span>
                    <Input
                      type="number"
                      value={tempHotendTemp}
                      onChange={(e) =>
                        setTempHotendTemp(Number(e.target.value))
                      }
                      className="w-20"
                    />
                    <span>°C</span>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
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
                </motion.div>
              </div>
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center justify-center bg-secondary rounded-md p-4">
                    <div className="text-center">
                      {uploadedFile ? (
                        <p>{uploadedFile.name}</p>
                      ) : (
                        <p>No GCode file uploaded</p>
                      )}
                      <label htmlFor="gcodeUpload">
                        <Button as="span" className="mt-2 cursor-pointer">
                          <Upload className="mr-2 h-4 w-4" />
                          <strong>
                            {uploadedFile ? "Change File" : "Upload GCode File"}
                          </strong>
                        </Button>
                      </label>
                      <input
                        id="gcodeUpload"
                        type="file"
                        accept=".gcode"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </div>
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <div className="bg-secondary rounded-md p-4">
                    <h3 className="font-semibold mb-2">Print Information</h3>
                    <p>Estimated Print Time: {estimatedTimeLeft}</p>
                    <p>Total Layers: {totalLayers}</p>
                    <p>Layer Height: {layerHeight}mm</p>
                  </div>
                </motion.div>
              </div>
            </div>
          </DialogDescription>
          <DialogFooter>
            <Button
              onClick={() => setShowStartPrintDialog(false)}
              variant="outline"
            >
              <strong>Cancel</strong>
            </Button>
            <Button
              onClick={handleStartPrint}
              className="bg-green-500 hover:bg-green-600"
              disabled={!uploadedFile || isLoading["startPrint"]}
            >
              {isLoading["startPrint"] ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <strong>Start Print</strong>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={showCancelPrintDialog}
        onOpenChange={setShowCancelPrintDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Print</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel the current print? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowCancelPrintDialog(false)}>
              <strong>Go Back</strong>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                onClick={() => {
                  setShowCancelPrintDialog(false);
                  onStopPrint();
                }}
                className="bg-red-500 hover:bg-red-600"
                variant="destructive"
              >
                <strong>Cancel Print</strong>
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
