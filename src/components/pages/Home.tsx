"use client";

import { useQuery } from "@tanstack/react-query";
import { Priority, Status, Type } from "../../../prisma/prisma";
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
import DataTablePagination from "../table/data-table-pagination";
import DataTableFilters from "../table/data-table-filters";
import { Button } from "../ui/button";

const HomeClientPage = () => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [queryText, setQueryText] = useState("");
  const [priority, setPriority] = useState<Priority | undefined>(undefined);
  const [status, setStatus] = useState<Status | undefined>(undefined);
  const [type, setType] = useState<Type | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const offset = pagination.pageIndex * pagination.pageSize;
  const limit = pagination.pageSize;

  //Search bar
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
    queryKey: ["tasks", queryText, limit, offset, priority, status, type, date],
    queryFn: () =>
      searchTask(queryText, limit, offset, priority, status, type, date),
    enabled: true,
  });
  console.log(date);

  //Pagination
  const totalCount = 3980;
  const pageCount = Math.ceil(totalCount / pagination.pageSize);

  function handlePageChange(newPageIndex: number) {
    if (newPageIndex < 0 || newPageIndex >= pageCount) return;
    setPagination((prev) => ({ ...prev, pageIndex: newPageIndex }));
  }

  function handlePageSizeChange(newPageSize: number) {
    setPagination({ pageIndex: 0, pageSize: newPageSize });
  }

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
        <div>
          <Input
            type="text"
            placeholder="Search items..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="max-w-1/4 px-4 py-4 border rounded mb-2"
          />
        </div>
        <div className="flex flex-row gap-x-2">
          <div>
            <DataTableFilters
              priority={priority}
              setPriority={setPriority}
              status={status}
              setStatus={setStatus}
              type={type}
              setType={setType}
              date={date}
              setDate={setDate}
            />
          </div>
          <div>
            <Button
              variant="secondary"
              size="sm"
              className="w-full p-2"
              onClick={() => {
                setPriority(undefined);
                setStatus(undefined);
                setType(undefined);
                setSearch("");
              }}
            >
              Clear Filters
            </Button>
          </div>
        </div>

        <DataTable columns={columns} data={data ?? []} isLoading={isLoading} />
        <DataTablePagination
          pageIndex={pagination.pageIndex}
          pageSize={pagination.pageSize}
          pageCount={pageCount}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          canPreviousPage={pagination.pageIndex > 0}
          canNextPage={pagination.pageIndex + 1 < pageCount}
        />
      </div>
    </main>
  );
};

export default HomeClientPage;
