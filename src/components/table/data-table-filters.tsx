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
import { cn } from "@/lib/utils"; // jeśli masz helper cn (classnames)

type DataTableFiltersProps = {
  priority: string | null;
  setPriority: (value: string | null) => void;
  status: string | null;
  setStatus: (value: string | null) => void;
  itc: string | null;
  setItc: (value: string | null) => void;
};

const DataTableFilters = ({
  priority,
  setPriority,
  status,
  setStatus,
  itc,
  setItc,
}: DataTableFiltersProps) => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<"root" | "priority" | "status" | "itc">(
    "root"
  );

  const handleBack = () => setView("root");

  const activeFiltersCount = [priority, status, itc].filter(Boolean).length;

  const buttonLabel = activeFiltersCount
    ? `Filter By (${activeFiltersCount})`
    : "Filter By";

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
                  <CommandItem onSelect={() => setView("priority")}>
                    Priority
                  </CommandItem>
                  <CommandItem onSelect={() => setView("status")}>
                    Status
                  </CommandItem>
                  <CommandItem onSelect={() => setView("itc")}>ITC</CommandItem>
                </CommandGroup>

                {/* Tylko na stronie root pokazujemy Clear All */}
                <div className="border-t p-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => {
                      setPriority(null);
                      setStatus(null);
                      setItc(null);
                      setOpen(false);
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
                      (item === "All" && priority === null);
                    return (
                      <CommandItem
                        key={item}
                        onSelect={() => {
                          setPriority(item === "All" ? null : item);
                          setOpen(false);
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
                {/* Clear button tylko tutaj */}
                <div className="border-t p-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => setPriority(null)}
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
                  {["OPEN", "IN_PROGRESS", "DONE", "All"].map((item) => {
                    const isSelected =
                      status === item || (item === "All" && status === null);
                    return (
                      <CommandItem
                        key={item}
                        onSelect={() => {
                          setStatus(item === "All" ? null : item);
                          setOpen(false);
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
                {/* Clear button tylko tutaj */}
                <div className="border-t p-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => setStatus(null)}
                  >
                    Clear
                  </Button>
                </div>
              </>
            )}

            {/* ITC VIEW */}
            {view === "itc" && (
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
                  {["ITC1", "ITC2", "ITC3", "All"].map((item) => {
                    const isSelected =
                      itc === item || (item === "All" && itc === null);
                    return (
                      <CommandItem
                        key={item}
                        onSelect={() => {
                          setItc(item === "All" ? null : item);
                          setOpen(false);
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
                {/* Clear button tylko tutaj */}
                <div className="border-t p-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => setItc(null)}
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
