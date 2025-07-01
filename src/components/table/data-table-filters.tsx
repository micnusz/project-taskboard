"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Check, ChevronLeft, Filter } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { Priority, Status, Type } from "../../../prisma/prisma";
import formatStatus from "@/modules/format-status";
import formatPriority from "@/modules/format-priority";
import formatType from "@/modules/format-type";

type DataTableFiltersProps = {
  priority: Priority | undefined;
  setPriority: (value: Priority | undefined) => void;
  status: Status | undefined;
  setStatus: (value: Status | undefined) => void;
  type: Type | undefined;
  setType: (value: Type | undefined) => void;
};

const DataTableFilters = ({
  priority,
  setPriority,
  status,
  setStatus,
  type,
  setType,
}: DataTableFiltersProps) => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"root" | "priority" | "status" | "type">(
    "root"
  );

  const handleBack = () => setView("root");

  const activeFiltersCount = [priority, status, type].filter(Boolean).length;

  const buttonLabel = activeFiltersCount
    ? `Filter By (${activeFiltersCount})`
    : "Filter By";

  // Funkcje pomocnicze do wyświetlania etykiety
  const getPriorityLabel = () =>
    priority ? `Priority: ${priority}` : "Priority";
  const getStatusLabel = () => (status ? `Status: ${status}` : "Status");
  const getTypeLabel = () => (type ? `Type: ${type}` : "Type");

  return (
    <Popover
      open={open}
      onOpenChange={(openState) => {
        setOpen(openState);
        if (!openState) setView("root");
      }}
      modal={true}
    >
      <PopoverTrigger asChild>
        <Button
          variant={activeFiltersCount ? "default" : "outline"}
          className="justify-between"
        >
          <Filter className="mr-2 h-4 w-4" />
          {buttonLabel}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[15rem] rounded-lg shadow-md p-1">
        <Command>
          <ScrollArea className="max-h-[24rem] overflow-y-auto">
            <CommandInput placeholder="Search filters..." />
            <CommandEmpty>No results found.</CommandEmpty>

            {/* ROOT VIEW */}
            {view === "root" && (
              <>
                <CommandGroup>
                  <CommandItem onSelect={() => setView("status")}>
                    {formatStatus(getStatusLabel())}
                  </CommandItem>
                  <CommandItem onSelect={() => setView("type")}>
                    {formatType(getTypeLabel())}
                  </CommandItem>
                  <CommandItem onSelect={() => setView("priority")}>
                    {formatPriority(getPriorityLabel())}
                  </CommandItem>
                </CommandGroup>
                <div className="border-t p-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setPriority(undefined);
                      setStatus(undefined);
                      setType(undefined);
                      setOpen(true);
                      setView("root");
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </>
            )}

            {/* PRIORITY VIEW */}
            {view === "priority" && (
              <>
                <CommandGroup>
                  <CommandItem
                    className="flex items-center gap-2"
                    onSelect={handleBack}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </CommandItem>
                </CommandGroup>
                <CommandGroup>
                  {["HIGH", "MEDIUM", "LOW"].map((item) => {
                    const isSelected =
                      priority === item ||
                      (item === "None" && priority === undefined);
                    return (
                      <CommandItem
                        className={cn(isSelected ? "bg-accent/70" : "")}
                        key={item}
                        onSelect={() => {
                          if (priority === item) {
                            setPriority(undefined);
                          } else {
                            setPriority(item as Priority);
                          }
                          setOpen(true);
                          setView("root");
                        }}
                      >
                        {formatPriority(item)}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                <div className="border-t p-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => setPriority(undefined)}
                  >
                    Clear
                  </Button>
                </div>
              </>
            )}

            {/* STATUS VIEW */}
            {view === "status" && (
              <>
                <CommandGroup>
                  <CommandItem
                    className="flex items-center gap-2"
                    onSelect={handleBack}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </CommandItem>
                </CommandGroup>
                <CommandGroup>
                  {["TODO", "IN_PROGRESS", "DONE", "CANCELED"]
                    .sort((a, b) => {
                      return a.localeCompare(b);
                    })
                    .map((item) => {
                      const isSelected =
                        status === item ||
                        (item === "None" && status === undefined);
                      return (
                        <CommandItem
                          className={cn(isSelected ? "bg-accent/70" : "")}
                          key={item}
                          onSelect={() => {
                            if (status === item) {
                              setStatus(undefined);
                            } else {
                              setStatus(item as Status);
                            }
                            setOpen(true);
                            setView("root");
                          }}
                        >
                          {formatStatus(item)}
                        </CommandItem>
                      );
                    })}
                </CommandGroup>
                <div className="border-t p-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => setStatus(undefined)}
                  >
                    Clear
                  </Button>
                </div>
              </>
            )}

            {/* TYPE VIEW */}
            {view === "type" && (
              <>
                <CommandGroup>
                  <CommandItem
                    className="flex items-center gap-2"
                    onSelect={handleBack}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </CommandItem>
                </CommandGroup>
                <CommandGroup>
                  {[
                    "BUG",
                    "FEATURE",
                    "ENHANCEMENT",
                    "DOCUMENTATION",
                    "OTHER",
                  ].map((item) => {
                    const isSelected =
                      type === item || (item === "None" && type === undefined);
                    return (
                      <CommandItem
                        className={cn(isSelected ? "bg-accent/70" : "")}
                        key={item}
                        onSelect={() => {
                          if (type === item) {
                            setType(undefined);
                          } else {
                            setType(item as Type);
                          }
                          setOpen(true);
                          setView("root");
                        }}
                      >
                        {formatType(item)}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
                <div className="border-t p-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => setType(undefined)}
                  >
                    Clear
                  </Button>
                </div>
              </>
            )}
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default DataTableFilters;
