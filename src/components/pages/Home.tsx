"use client";

import { useQuery } from "@tanstack/react-query";
import { Priority, Status, Type, User } from "../../../prisma/prisma";
import Form from "../Form";
import { DataTable } from "../table/data-table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getTaskCount, getAuthors, searchTask } from "@/actions/actions";
import { useEffect, useMemo, useState } from "react";
import debounce from "lodash.debounce";
import { Input } from "../ui/input";
import DataTableFilters from "../table/data-table-filters";
import { Button } from "../ui/button";
import { getColumns } from "../table/columns";
import { TaskWithAuthor } from "@/lib/types";

const HomeClientPage = () => {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [search, setSearch] = useState("");
  const [queryText, setQueryText] = useState("");
  const [priority, setPriority] = useState<Priority | undefined>(undefined);
  const [status, setStatus] = useState<Status | undefined>(undefined);
  const [type, setType] = useState<Type | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [sortField, setSortField] = useState<string>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [author, setAuthor] = useState<User | undefined>(undefined);
  const [open, setOpen] = useState(false);

  const offset = pagination.pageIndex * pagination.pageSize;
  const limit = pagination.pageSize;

  //Get Tasks
  const { data, isLoading } = useQuery<TaskWithAuthor[]>({
    queryKey: [
      "tasks",
      queryText,
      limit,
      offset,
      priority,
      status,
      type,
      date,
      sortField,
      sortOrder,
      author?.id,
    ],
    queryFn: () =>
      searchTask(
        queryText,
        limit,
        offset,
        priority,
        status,
        type,
        date,
        sortField,
        sortOrder,
        author?.id
      ),
  });
  //Get Tasks count
  const { data: tasksCount } = useQuery<number>({
    queryKey: [
      "task-count",
      queryText,
      priority,
      status,
      type,
      date,
      author?.id,
    ],
    queryFn: () =>
      getTaskCount(queryText, priority, status, type, date, author?.id),
  });
  //Get users
  const { data: userData } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => getAuthors(),
  });

  //Columns
  const columns = useMemo(
    () =>
      getColumns({
        sortField,
        sortOrder,
        setSortField,
        setSortOrder,
      }),
    [sortField, sortOrder]
  );

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

  //Clear button filter
  const isFiltered =
    priority !== undefined ||
    status !== undefined ||
    type !== undefined ||
    date !== undefined ||
    author !== undefined ||
    search !== "";

  //Pagination
  const totalCount = tasksCount ?? 0;
  const pageCount = Math.max(1, Math.ceil(totalCount / pagination.pageSize));

  const handlePageChange = (newPageIndex: number) => {
    if (!pageCount) return;
    if (newPageIndex < 0 || newPageIndex >= pageCount) return;
    setPagination((prev) => ({ ...prev, pageIndex: newPageIndex }));
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPagination({ pageIndex: 0, pageSize: newPageSize });
  };

  return (
    <main className="px-fluid py-fluid">
      <div>
        <div className="flex flex-col gap-x-2">
          <div className="flex flex-row gap-x-2">
            <Input
              type="text"
              placeholder="Search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:max-w-1/4 px-4 py-4 border rounded-md mb-2"
            />
            <div>
              <Button
                className="w-fit"
                variant={isFiltered ? "destructive" : "muted"}
                onClick={() => {
                  setPriority(undefined);
                  setStatus(undefined);
                  setType(undefined);
                  setDate(undefined);
                  setAuthor(undefined);
                  setSearch("");
                }}
              >
                Clear
              </Button>
            </div>
          </div>

          <div className="flex flex-row gap-x-2 mb-2">
            <DataTableFilters
              userData={userData ?? []}
              priority={priority}
              setPriority={setPriority}
              status={status}
              setStatus={setStatus}
              type={type}
              setType={setType}
              date={date}
              setDate={setDate}
              author={author}
              setAuthor={setAuthor}
            />

            <div>
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    Add Task
                  </Button>
                </DialogTrigger>
                <DialogContent className="min-h-[20rem] max-h-screen">
                  <DialogHeader>
                    <DialogTitle>Create Task:</DialogTitle>
                    <div>
                      <Form onSuccess={() => setOpen(false)} />
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={data ?? []}
          isLoading={isLoading}
          pagination={{
            pageIndex: pagination.pageIndex,
            pageSize: pagination.pageSize,
            pageCount: pageCount,
            onPageChange: handlePageChange,
            onPageSizeChange: handlePageSizeChange,
            canPreviousPage: pagination.pageIndex > 0,
            canNextPage: pagination.pageIndex + 1 < pageCount,
          }}
        />
      </div>
    </main>
  );
};

export default HomeClientPage;
