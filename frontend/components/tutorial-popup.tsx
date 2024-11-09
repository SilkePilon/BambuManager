"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
  ChevronLeft,
  ChevronRight,
  X,
  Printer,
  Sliders,
  Play,
  Plus,
  HelpCircle,
  Thermometer,
  Fan,
  Lightbulb,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { cn } from "@/lib/utils";

const filamentOptions = [
  { value: "PLA", label: "PLA", description: "General purpose, easy to print" },
  { value: "ABS", label: "ABS", description: "Durable, heat-resistant" },
  { value: "PETG", label: "PETG", description: "Strong, chemical-resistant" },
  { value: "TPU", label: "TPU", description: "Flexible, impact-resistant" },
  { value: "Nylon", label: "Nylon", description: "Strong, abrasion-resistant" },
];

const tutorialSlides = [
  {
    title: "Welcome to the 3D Printer Dashboard",
    content:
      "This dashboard allows you to monitor and control your 3D printers. Let's explore the main features together!",
    icon: <HelpCircle className="h-12 w-12 text-blue-500" />,
    example: (
      <div className="flex h-full items-center justify-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Printer className="h-24 w-24 text-blue-500" />
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
    title: "Add New Printers",
    content:
      "Click the 'Add Printer' button at the bottom of the dashboard to add a new printer to your fleet. You'll be prompted to enter the printer's name and type, allowing you to expand your printing capabilities.",
    icon: <Plus className="h-12 w-12 text-yellow-500" />,
    example: (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Add New Printer</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="printer-name">Printer Name</Label>
              <Input id="printer-name" placeholder="Enter printer name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="printer-type">Printer Type</Label>
              <Input id="printer-type" placeholder="Enter printer type" />
            </div>
            <Button className="w-full">Add Printer</Button>
          </div>
        </CardContent>
      </Card>
    ),
  },
];

interface TutorialPopupProps {
  onClose: () => void;
  onAddPrinter: (name: string, type: string) => void;
}

export function TutorialPopup({ onClose, onAddPrinter }: TutorialPopupProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { theme } = useTheme();
  const [newPrinterName, setNewPrinterName] = useState("");
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
    if (newPrinterName && newPrinterType) {
      onAddPrinter(newPrinterName, newPrinterType);
      setNewPrinterName("");
      setNewPrinterType("");
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 backdrop-blur-sm bg-black bg-opacity-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`relative w-full max-w-4xl rounded-xl p-6 shadow-xl bg-primary-foreground text-primary-content`}
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        <div className="mb-6 flex items-center justify-center">
          {tutorialSlides[currentSlide].icon}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 gap-6 md:grid-cols-2"
          >
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">
                {tutorialSlides[currentSlide].title}
              </h2>
              <p className="text-lg">{tutorialSlides[currentSlide].content}</p>
              {currentSlide === tutorialSlides.length - 1 && (
                <div className="space-y-4">
                  <Input
                    placeholder="Enter printer name"
                    value={newPrinterName}
                    onChange={(e) => setNewPrinterName(e.target.value)}
                  />
                  <Input
                    placeholder="Enter printer type"
                    value={newPrinterType}
                    onChange={(e) => setNewPrinterType(e.target.value)}
                  />
                  <Button
                    onClick={handleAddPrinter}
                    disabled={!newPrinterName || !newPrinterType}
                  >
                    Add Printer
                  </Button>
                </div>
              )}
            </div>
            <div className="flex items-center justify-center">
              {tutorialSlides[currentSlide].example}
            </div>
          </motion.div>
        </AnimatePresence>
        <div className="mt-6 flex justify-between">
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
        <div className="mt-4 flex justify-center">
          {tutorialSlides.map((_, index) => (
            <div
              key={index}
              className={`mx-1 h-2 w-2 rounded-full ${
                index === currentSlide
                  ? theme === "dark"
                    ? "bg-primary"
                    : "bg-primary"
                  : theme === "dark"
                  ? "bg-gray-200"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
