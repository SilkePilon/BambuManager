"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  ChevronLeft,
  ChevronRight,
  X,
  AlignLeft,
  Info,
  Printer,
  Sliders,
  Play,
  Plus,
  HelpCircle,
  Thermometer,
  Fan,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const printerTypes = [
  {
    value: "X1 Carbon",
    label: "X1 Carbon",
    image:
      "https://erasebg.org/media/background-remover/031d91a8-49bd-45c8-a073-56eafce052dc/transparent/114_2_400x.png",
  },
  {
    value: "P1S",
    label: "P1S",
    image:
      "https://eu.store.bambulab.com/cdn/shop/files/P1S_a91816a0-e8da-4fde-aeee-5063b3c58d23_400x.png?v=1719566484",
  },
  {
    value: "P1P",
    label: "P1P",
    image:
      "https://eu.store.bambulab.com/cdn/shop/files/P1P_a4d89e24-eafb-468c-bfa5-acf5c178b9b6_400x.png?v=1719566484",
  },
  {
    value: "A1",
    label: "A1",
    image:
      "https://eu.store.bambulab.com/cdn/shop/files/A1_06418bc8-eb86-4622-ab5f-dab3bfb0dcf7_400x.png?v=1719566483",
  },
  {
    value: "A1 Mini",
    label: "A1 Mini",
    image:
      "https://eu.store.bambulab.com/cdn/shop/files/A1_mini_400x.png?v=1719566482",
  },
];

const tutorialSlides = [
  {
    title: "Welcome to BambuManager!",
    content:
      "This dashboard allows you to monitor and control your loved bambulabs 3D printers. Let's explore the main features together!",
    icon: <HelpCircle className="h-12 w-12 text-green-500" />,
    example: (
      <div className="flex h-full items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            id="Layer_2"
            data-name="Layer 2"
            viewBox="0 0 499.87 650.42"
            className="h-40 w-40"
            fill="#22C55E"
          >
            <g id="Layer_1-2" data-name="Layer 1">
              <g>
                <path d="M268.35,242.77c13.19,5.16,25.85,10.1,38.49,15.08,62.68,24.68,125.34,49.4,188.07,73.97,3.64,1.42,4.97,3.05,4.96,7.12-.14,101.82-.11,203.65-.11,305.47,0,1.78,0,3.57,0,5.67-2.18,.1-3.8,.24-5.43,.24-73.49,.01-146.99-.03-220.48,.1-4.51,0-5.88-1.09-5.88-5.77,.13-132.15,.1-264.31,.11-396.46,0-1.6,.14-3.2,.25-5.42Z" />
                <path d="M.35,0H231.48c.1,1.65,.26,3.1,.26,4.55,.03,5.5,0,11,.01,16.49,.08,96.29,.13,192.58,.36,288.87,.01,4.7-1.38,6.87-5.8,8.6-73.4,28.72-146.72,57.64-220.06,86.51-1.8,.71-3.65,1.29-5.91,2.08V0Z" />
                <path d="M231.61,650.32h-6.48c-72.82,0-145.64,0-218.47,0q-6.57,0-6.58-6.37c0-63.99,.04-127.98-.09-191.97,0-4.05,1.05-6.05,5.04-7.61,74.17-29.07,148.26-58.32,222.38-87.52,1.2-.47,2.47-.79,4.19-1.32v294.79Z" />
                <path d="M268.09,.01h231.38V294.51c-2.37-.82-4.64-1.51-6.84-2.38-73.17-28.83-146.33-57.72-219.55-86.42-3.99-1.56-5.08-3.5-5.07-7.57,.12-64.14,.09-128.27,.09-192.41,0-1.79,0-3.59,0-5.72Z" />
              </g>
            </g>
          </svg>
        </motion.div>
      </div>
    ),
  },
  {
    title: "Printer Cards",
    content:
      "Each card represents a 3D printer. You can see the printer's status, current temperatures, and print progress at a glance. The color-coded status badge quickly shows you if a printer is idle, printing, or has completed a job.",
    icon: <Printer className="h-12 w-12 text-green-500" />,
    example: (
      <Card className="w-full max-w-sm">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-bold">Creeper</CardTitle>
            <Badge className="bg-purple-500 text-white">Printing</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex flex-col items-center justify-center">
              <Thermometer className="h-5 w-5 text-red-500" />
              <span className="font-semibold">210°C</span>
              <span className="text-xs text-muted-foreground">Hotend</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <Thermometer className="h-5 w-5 text-blue-500" />
              <span className="font-semibold">60°C</span>
              <span className="text-xs text-muted-foreground">Bed</span>
            </div>
            <div className="flex flex-col items-center justify-center">
              <span className="font-semibold">65%</span>
              <span className="text-xs text-muted-foreground">Progress</span>
            </div>
          </div>
        </CardContent>
      </Card>
    ),
  },
  {
    title: "Detailed View",
    content:
      "Click on 'Details' to open a detailed view of the printer. Here you can adjust settings like temperature, fan speed, and print speed. You'll also find more in-depth information about the current print job.",
    icon: <Sliders className="h-12 w-12 text-purple-500" />,
    example: (
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-red-500" />
          <span>Hotend Temperature:</span>
          <Input type="number" defaultValue={210} className="w-20" />
          <span>°C</span>
        </div>
        <div className="flex items-center gap-2">
          <Thermometer className="h-5 w-5 text-blue-500" />
          <span>Bed Temperature:</span>
          <Input type="number" defaultValue={60} className="w-20" />
          <span>°C</span>
        </div>
        <div className="flex items-center gap-2">
          <Fan className="h-5 w-5 text-cyan-500" />
          <span>Fan Speed:</span>
          <Input type="number" defaultValue={100} className="w-20" />
          <span>%</span>
        </div>
      </div>
    ),
  },
  {
    title: "Start/Stop Prints",
    content:
      "Use the 'Start Print' or 'Cancel' buttons to control your print jobs. You can also upload new G-code files to start a new print. These controls allow you to manage your prints remotely.",
    icon: <Play className="h-12 w-12 text-red-500" />,
    example: (
      <div className="space-y-4">
        <Button variant="default" size="sm" className="w-full">
          Start Print
        </Button>
        <Button variant="destructive" size="sm" className="w-full">
          Cancel Print
        </Button>
        <Button variant="outline" size="sm" className="w-full">
          Upload G-code
        </Button>
      </div>
    ),
  },
  {
    title: "Let's add your first printer",
    content: "",
    icon: <Plus className="h-12 w-12 text-yellow-500" />,
    example: <></>,
  },
];

interface TutorialPopupProps {
  onClose: () => void;
  onAddPrinter: (name: string, type: string) => void;
}

export default function Component({
  onClose,
  onAddPrinter,
}: TutorialPopupProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { theme } = useTheme();
  const [printerIP, setPrinterIP] = useState("");
  const [printerSerial, setPrinterSerial] = useState("");
  const [printerAccessCode, setPrinterAccessCode] = useState("");
  const [newPrinterType, setNewPrinterType] = useState("");

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % tutorialSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + tutorialSlides.length) % tutorialSlides.length
    );
  };

  const handleAddPrinter = () => {
    if (printerIP && printerSerial && printerAccessCode && newPrinterType) {
      onAddPrinter(printerIP, newPrinterType);
      setPrinterIP("");
      setPrinterSerial("");
      setPrinterAccessCode("");
      setNewPrinterType("");
      onClose();
    }
  };

  const isValidIP = (ip: string) => {
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    return ipRegex.test(ip);
  };

  const getInputBorderColor = (
    value: string,
    validator?: (value: string) => boolean
  ) => {
    if (!value) return "border-red-500 border-2";
    if (validator && !validator(value)) return "border-red-500 border-2";
    return "border-green-500 border-2";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-5xl rounded-xl bg-background p-8 text-foreground shadow-xl"
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
        <div className="mb-6 flex items-center justify-center">
          {/* {tutorialSlides[currentSlide].icon} */}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-8 md:grid-cols-2"
          >
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">
                {tutorialSlides[currentSlide].title}
              </h2>
              <p className="text-xl">{tutorialSlides[currentSlide].content}</p>
              {currentSlide === tutorialSlides.length - 1 && (
                <Card className="w-full">
                  <CardContent className="pt-6">
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="printer-ip">Printer IP</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Info className="h-4 w-4" />
                                <span className="ml-2 underline">
                                  How to get IP
                                </span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <p>
                                You can find your printer&apos;s IP address in
                                the printer&apos;s settings menu or by checking
                                your router&apos;s connected devices list.
                              </p>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <Input
                          id="printer-ip"
                          placeholder="Enter printer IP"
                          value={printerIP}
                          onChange={(e) => setPrinterIP(e.target.value)}
                          className={getInputBorderColor(printerIP, isValidIP)}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="printer-serial">
                            Printer Serial Number
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Info className="h-4 w-4" />
                                <span className="ml-2 underline">
                                  How to get Serial
                                </span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <p>
                                Please visit the{" "}
                                <a
                                  href="https://wiki.bambulab.com/en/general/find-sn"
                                  target="_blank"
                                  className="underline"
                                >
                                  official bambulab wiki
                                </a>{" "}
                                to find the serial location for your specific
                                printer.
                              </p>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <Input
                          id="printer-serial"
                          placeholder="Enter printer serial number"
                          value={printerSerial}
                          onChange={(e) => setPrinterSerial(e.target.value)}
                          className={getInputBorderColor(printerSerial)}
                        />
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="printer-access-code">
                            Device Access Code
                          </Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <Info className="h-4 w-4" />
                                <span className="ml-2 underline">
                                  How to get Access Code
                                </span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80">
                              <p>
                                The device access code can be found in your
                                printer&apos;s settings or security menu. For
                                info for specific printers please visit{" "}
                                <a
                                  href="https://intercom.help/octoeverywhere/en/articles/9028357-find-your-bambu-lab-printer-access-code"
                                  target="_blank"
                                  className="underline"
                                >
                                  this site
                                </a>
                              </p>
                            </PopoverContent>
                          </Popover>
                        </div>
                        <InputOTP
                          maxLength={12}
                          value={printerAccessCode}
                          onChange={setPrinterAccessCode}
                          className={getInputBorderColor(printerAccessCode)}
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                            <InputOTPSlot index={6} />
                            <InputOTPSlot index={7} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-printer-type">Printer Type</Label>
                        <Select
                          value={newPrinterType}
                          onValueChange={setNewPrinterType}
                        >
                          <SelectTrigger id="new-printer-type">
                            <SelectValue placeholder="Select printer type" />
                          </SelectTrigger>
                          <SelectContent>
                            {printerTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Button
                        className="w-full"
                        onClick={handleAddPrinter}
                        disabled={
                          !printerIP ||
                          !printerSerial ||
                          !printerAccessCode ||
                          !newPrinterType ||
                          !isValidIP(printerIP)
                        }
                      >
                        Add Printer
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            <div className="flex items-center justify-center">
              {currentSlide === tutorialSlides.length - 1 ? (
                <div className="flex flex-col items-center justify-center">
                  <AnimatePresence mode="wait">
                    {newPrinterType ? (
                      <motion.img
                        key={newPrinterType}
                        src={
                          printerTypes.find((t) => t.value === newPrinterType)
                            ?.image
                        }
                        alt={`${newPrinterType} printer`}
                        className="h-96 w-96 object-contain"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="flex h-96 w-96 flex-col items-center justify-center text-center"
                      >
                        <AlignLeft className="h-32 w-32 text-muted-foreground" />
                        <p className="mt-4 text-xl font-semibold text-muted-foreground">
                          Please select a printer from the list
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {newPrinterType && (
                    <p className="mt-4 text-center text-xl font-semibold">
                      {newPrinterType || ""}
                    </p>
                  )}
                </div>
              ) : (
                tutorialSlides[currentSlide].example
              )}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-8 flex justify-between">
          <Button
            onClick={prevSlide}
            disabled={currentSlide === 0}
            variant="secondary"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          {currentSlide === tutorialSlides.length - 1 ? (
            <Button onClick={onClose} variant="default">
              I&apos;ll do it later
            </Button>
          ) : (
            <Button onClick={nextSlide} variant="default">
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
        <div className="mt-6 flex justify-center">
          {tutorialSlides.map((_, index) => (
            <div
              key={index}
              className={`mx-1 h-2 w-2 rounded-full ${
                index === currentSlide ? "bg-primary" : "bg-secondary"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
