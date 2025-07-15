"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { getAuthorInfo, getAuthorTask } from "@/actions/actions";
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
import AuthorSkeleton from "../ui/author-skeleton";

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

  const { data: authorInfo, isLoading: isLoadingInfo } = useSuspenseQuery({
    queryKey: ["authorInfo", id],
    queryFn: () => getAuthorInfo(id),
  });

  const {
    data: authorData,
    isLoading,
    isFetching,
  } = useQuery<AuthorWithTasks>({
    queryKey: [
      "author",
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

  const filteredTasks = authorData?.tasks.filter((task) => {
    const query = search.toLowerCase();
    return (
      task.id.toLowerCase().includes(query) ||
      task.title.toLowerCase().includes(query) ||
      task.description?.toLowerCase().includes(query)
    );
  });

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
          <h2 className="responsive-h2">
            <Label className="text-muted-foreground">Email:</Label>
            {authorInfo?.email}
          </h2>
        </div>
      </section>
      <section className="md:w-3/4">
        <div className="flex flex-row gap-x-2 pb-4">
          <Input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border xs:w-full sm:w-[20rem] md:w-[20rem] duration-200 ease-in-out rounded-md border-3 border-input transition-colors hover:border-chart-1"
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
            filteredTasks?.map((task) => (
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
      </section>
    </main>
  );
};

export default AuthorPage;
