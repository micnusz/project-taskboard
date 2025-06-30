"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { Task } from "../../../prisma/prisma";
import Form from "../Form";
import { columns } from "../table/columns";
import { DataTable } from "../table/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { searchTask } from "@/actions/actions";
import { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { Input } from "../ui/input";

const HomeClientPage = () => {
  const [search, setSearch] = useState("");
  const [queryText, setQueryText] = useState("");

  const debouncedSetQueryText = useMemo(
    () =>
      debounce((text: string) => {
        setQueryText(text);
      }, 300),
    []
  );

  useEffect(() => {
    debouncedSetQueryText(search);
    return () => {
      debouncedSetQueryText.cancel();
    };
  }, [search, debouncedSetQueryText]);

  const { data, isLoading } = useQuery({
    queryKey: ["task", queryText],
    queryFn: () => searchTask(queryText),
    enabled: true,
  });

  return (
    <main className="px-fluid ">
      <Dialog>
        <DialogTrigger className="border-2 p-2">Add Task</DialogTrigger>
        <DialogContent className="min-h-[20rem] max-h-screen">
          <DialogHeader>
            <DialogTitle>Create Task:</DialogTitle>
            <div>
              {/* Creating Task */}
              <Form />
            </div>
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div>
        <Input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-4 border rounded mb-2"
        />
        <DataTable columns={columns} data={data ?? []} />
      </div>
    </main>
  );
};

export default HomeClientPage;
