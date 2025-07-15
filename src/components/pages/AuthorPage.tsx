"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  getAuthorInfo,
  getAuthorTask,
  getAuthorTaskCount,
  getTaskCount,
} from "@/actions/actions";
import { AuthorWithTasks, BadgeVariant } from "@/lib/types";
import TaskCard from "../TaskCard";
import { useEffect, useMemo, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { User } from "lucide-react";
import { Badge } from "../ui/badge";
import { Label } from "../ui/label";
import { Priority, Status, Type } from "../../../prisma/prisma";
import TaskFilter from "../TaskFilter";
import debounce from "lodash.debounce";
import Spinner from "@/lib/Spinner";
import DataTablePagination from "../table/data-table-pagination";

type AuthorPageProps = {
  id: string;
};

const AuthorPage = ({ id }: AuthorPageProps) => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [search, setSearch] = useState("");
  const [queryText, setQueryText] = useState("");
  const [priority, setPriority] = useState<Priority | undefined>(undefined);
  const [status, setStatus] = useState<Status | undefined>(undefined);
  const [type, setType] = useState<Type | undefined>(undefined);
  const [date, setDate] = useState<Date | undefined>(undefined);

  const offset = pagination.pageIndex * pagination.pageSize;
  const limit = pagination.pageSize;

  //Author info
  const { data: authorInfo } = useQuery({
    queryKey: ["author-info", id],
    queryFn: () => getAuthorInfo(id),
  });
  //Task count
  const { data: tasksCount } = useQuery({
    queryKey: ["task-count", id, queryText, priority, status, type, date],
    queryFn: () =>
      getAuthorTaskCount(id, queryText, priority, status, type, date),
  });
  //Author tasks data
  const { data: authorData, isFetching } = useQuery<AuthorWithTasks>({
    queryKey: [
      "author-tasks",
      id,
      queryText,
      limit,
      offset,
      priority,
      status,
      type,
      date,
    ],
    queryFn: () =>
      getAuthorTask(id, queryText, limit, offset, priority, status, type, date),
    enabled: !!id,
  });

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

  //Clear filters
  const handleClear = () => {
    setSearch("");
    setPriority(undefined);
    setStatus(undefined);
    setType(undefined);
    setDate(undefined);
  };

  const isFiltered =
    search !== "" ||
    priority !== undefined ||
    status !== undefined ||
    type !== undefined ||
    date !== undefined;

  const formattedRole = authorInfo?.role
    ? authorInfo.role.toLowerCase().replace(/^./, (c) => c.toUpperCase())
    : "";

  const role = authorInfo?.role.toLowerCase() as BadgeVariant;

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
    <main className="w-screen px-fluid py-fluid flex flex-col md:flex-row">
      <section className="md:w-1/4 pb-6">
        <div className="flex flex-col gap-y-4">
          <span>
            <User className="flex-1 responsive-user rounded-full text-muted-foreground" />
          </span>
          <div className="flex flex-row gap-x-4 flex-wrap">
            <h1 className="responsive-h1">{authorInfo?.name}</h1>
            <h2>
              <Badge className="responsive-h1" variant={role ?? "default"}>
                {formattedRole}
              </Badge>
            </h2>
          </div>
          <div className=" flex flex-col gap-1">
            <Label className="text-muted-foreground text-md">Email:</Label>
            <span className="responsive-h2">{authorInfo?.email}</span>
          </div>
        </div>
      </section>
      <section className="md:w-3/4">
        <div className="flex flex-row gap-x-2 pb-4">
          <Input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:max-w-1/4 px-4 py-4 border rounded-md mb-2"
          />
          <TaskFilter
            priority={priority}
            setPriority={setPriority}
            status={status}
            setStatus={setStatus}
            type={type}
            setType={setType}
            date={date}
            setDate={setDate}
          />

          <Button
            variant={isFiltered ? "destructive" : "muted"}
            onClick={() => handleClear()}
          >
            Clear
          </Button>
        </div>
        <div className="flex flex-wrap gap-4">
          {isFetching ? (
            <Spinner />
          ) : authorData?.tasks && authorData.tasks.length > 0 ? (
            authorData.tasks?.map((task) => (
              <div
                key={task.id}
                className="flex-1 sm:w-screen min-w-[15rem] md:min-w-[18rem]"
              >
                <TaskCard task={task} />
              </div>
            ))
          ) : (
            <p>No tasks found.</p>
          )}
        </div>
        <DataTablePagination
          pageIndex={pagination.pageIndex}
          pageSize={pagination.pageSize}
          pageCount={pageCount}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          canPreviousPage={pagination.pageIndex > 0}
          canNextPage={pagination.pageIndex + 1 < pageCount}
        />
      </section>
    </main>
  );
};

export default AuthorPage;
