"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ChevronLeft, Filter } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { Priority, Status, Type, User } from "../../../prisma/prisma";
import formatStatus from "@/modules/format-status";
import formatPriority from "@/modules/format-priority";
import formatType from "@/modules/format-type";
import { formatDate } from "@/modules/format-date";
import { Calendar } from "../ui/calendar";
import formatRole from "@/modules/format-role";

type DataTableFiltersProps = {
  priority: Priority | undefined;
  setPriority: (value: Priority | undefined) => void;
  status: Status | undefined;
  setStatus: (value: Status | undefined) => void;
  type: Type | undefined;
  setType: (value: Type | undefined) => void;
  date: Date | undefined;
  setDate: (value: Date | undefined) => void;
  author: User | undefined;
  setAuthor: (value: User | undefined) => void;
  userData: User[];
};

const DataTableFilters = ({
  priority,
  setPriority,
  status,
  setStatus,
  type,
  setType,
  date,
  setDate,
  author,
  setAuthor,
  userData,
}: DataTableFiltersProps) => {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<
    "root" | "priority" | "status" | "type" | "date" | "author"
  >("root");

  //Handle back
  const handleBack = () => setView("root");

  //Filters count
  const activeFiltersCount = [priority, status, type, date, author].filter(
    Boolean
  ).length;

  const buttonLabel = activeFiltersCount
    ? `Filter By (${activeFiltersCount})`
    : "Filter By";

  // Funkcje pomocnicze do wyświetlania etykiety
  const getPriorityLabel = () =>
    priority ? `Priority: ${priority}` : "Priority: Any";
  const getStatusLabel = () => (status ? `Status: ${status}` : "Status: Any");
  const getTypeLabel = () => (type ? `Type: ${type}` : "Type: Any");

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
      <PopoverContent className="min-w-[15rem] w-fit max-w-[20rem] rounded-lg shadow-md p-1">
        <Command>
          <ScrollArea className="max-h-[30rem] h-fit overflow-y-auto">
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
                  <CommandItem onSelect={() => setView("date")}>
                    {date
                      ? `Created At: ${formatDate(date)}`
                      : "Created At: Any"}
                  </CommandItem>
                  <CommandItem onSelect={() => setView("author")}>
                    {author
                      ? `Created By: ${author.email} `
                      : "Created By: Any"}
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
                      setDate(undefined);
                      setAuthor(undefined);
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
                  <CommandItem onSelect={handleBack}>
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
                  <CommandItem className="" onSelect={handleBack}>
                    <ChevronLeft />
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
                  <CommandItem onSelect={handleBack}>
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
            {/* DATE VIEW */}
            {view === "date" && (
              <>
                <CommandGroup>
                  <CommandItem onSelect={handleBack}>
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </CommandItem>
                </CommandGroup>
                <CommandGroup>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    className="rounded-lg border"
                  />
                </CommandGroup>
                <div className="border-t p-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => setDate(undefined)}
                  >
                    Clear
                  </Button>
                </div>
              </>
            )}
            {/* AUTHOR VIEW */}
            {view === "author" && (
              <>
                <CommandGroup>
                  <CommandItem onSelect={handleBack}>
                    <ChevronLeft className="w-4 h-4" />
                    Back
                  </CommandItem>
                </CommandGroup>
                <CommandGroup>
                  {userData?.map((user) => {
                    const isSelected =
                      author === user ||
                      (user === "None" && author === undefined);
                    return (
                      <CommandItem
                        className={cn(isSelected ? "bg-accent/70" : "")}
                        key={user.id}
                        onSelect={() => {
                          if (author === user) {
                            setAuthor(undefined);
                          } else {
                            setAuthor(user as User);
                          }
                          setOpen(true);
                          setView("root");
                        }}
                      >
                        <div className="flex flex-row  gap-x-2">
                          <span>{user?.email}</span>
                          <span>{formatRole(user?.role)}</span>
                        </div>
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
