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
      <PopoverContent className="w-72 rounded-lg shadow-md p-0">
        <Command>
          <ScrollArea className="max-h-[24rem] overflow-y-auto">
            <CommandInput placeholder="Search filters..." />
            <CommandEmpty>No results found.</CommandEmpty>

            {/* ROOT VIEW */}
            {view === "root" && (
              <>
                <CommandGroup>
                  <CommandItem onSelect={() => setView("status")}>
                    {getStatusLabel()}
                  </CommandItem>
                  <CommandItem onSelect={() => setView("type")}>
                    {getTypeLabel()}
                  </CommandItem>
                  <CommandItem onSelect={() => setView("priority")}>
                    {getPriorityLabel()}
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
                  {["HIGH", "MEDIUM", "LOW", "All"].map((item) => {
                    const isSelected =
                      priority === item ||
                      (item === "All" && priority === undefined);
                    return (
                      <CommandItem
                        key={item}
                        onSelect={() => {
                          setPriority(
                            item === "All" ? undefined : (item as Priority)
                          );
                          setOpen(true);
                          setView("root");
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {item}
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
                  {["TODO", "IN_PROGRESS", "DONE", "CANCELED", "All"].map(
                    (item) => {
                      const isSelected =
                        status === item ||
                        (item === "All" && status === undefined);
                      return (
                        <CommandItem
                          key={item}
                          onSelect={() => {
                            setStatus(
                              item === "All" ? undefined : (item as Status)
                            );
                            setOpen(true);
                            setView("root");
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              isSelected ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {item}
                        </CommandItem>
                      );
                    }
                  )}
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
                    "All",
                  ].map((item) => {
                    const isSelected =
                      type === item || (item === "All" && type === undefined);
                    return (
                      <CommandItem
                        key={item}
                        onSelect={() => {
                          setType(item === "All" ? undefined : (item as Type));
                          setOpen(true);
                          setView("root");
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {item}
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
