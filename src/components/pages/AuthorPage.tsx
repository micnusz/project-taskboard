"use client";

import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import {
  getAuthorInfo,
  getAuthorTask,
  getAuthorTaskCount,
  getTaskCount,
} from "@/actions/actions";
import {
  AuthorPageAction,
  AuthorPageState,
  AuthorWithTasks,
  BadgeVariant,
} from "@/lib/types";
import TaskCard from "../TaskCard";
import { useEffect, useMemo, useReducer, useState } from "react";
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
const initialState: AuthorPageState = {
  pagination: { pageIndex: 0, pageSize: 10 },
  search: "",
  queryText: "",
  priority: undefined,
  status: undefined,
  type: undefined,
  date: undefined,
};

const reducer = (
  state: AuthorPageState,
  action: AuthorPageAction
): AuthorPageState => {
  switch (action.type) {
    case "SET_PAGINATION":
      return { ...state, pagination: action.payload };
    case "SET_SEARCH":
      return { ...state, search: action.payload };
    case "SET_QUERY_TEXT":
      return { ...state, queryText: action.payload };
    case "SET_PRIORITY":
      return { ...state, priority: action.payload };
    case "SET_STATUS":
      return { ...state, status: action.payload };
    case "SET_TYPE":
      return { ...state, type: action.payload };
    case "SET_DATE":
      return { ...state, date: action.payload };
    case "CLEAR_FILTERS":
      return {
        ...state,
        priority: undefined,
        status: undefined,
        type: undefined,
        date: undefined,
        search: "",
      };
    default:
      return state;
  }
};

const AuthorPage = ({ id }: AuthorPageProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const offset = state.pagination.pageIndex * state.pagination.pageSize;
  const limit = state.pagination.pageSize;

  //Author info
  const { data: authorInfo } = useQuery({
    queryKey: ["author-info", id],
    queryFn: () => getAuthorInfo(id),
  });
  //Task count
  const { data: tasksCount } = useQuery({
    queryKey: [
      "task-count",
      id,
      state.queryText,
      state.priority,
      state.status,
      state.type,
      state.date,
    ],
    queryFn: () =>
      getAuthorTaskCount(
        id,
        state.queryText,
        state.priority,
        state.status,
        state.type,
        state.date
      ),
  });
  //Author tasks data
  const { data: authorData, isFetching } = useQuery<AuthorWithTasks>({
    queryKey: [
      "author-tasks",
      id,
      state.queryText,
      limit,
      offset,
      state.priority,
      state.status,
      state.type,
      state.date,
    ],
    queryFn: () =>
      getAuthorTask(
        id,
        state.queryText,
        limit,
        offset,
        state.priority,
        state.status,
        state.type,
        state.date
      ),
    enabled: !!id,
  });

  //Search bar

  //Search bar
  const debouncedSetQueryText = useMemo(
    () =>
      debounce((text: string) => {
        dispatch({ type: "SET_QUERY_TEXT", payload: text });
      }, 300),
    []
  );
  useEffect(() => {
    debouncedSetQueryText(state.search);
    return () => debouncedSetQueryText.cancel();
  }, [state.search, debouncedSetQueryText]);

  const isFiltered =
    state.priority !== undefined ||
    state.status !== undefined ||
    state.type !== undefined ||
    state.date !== undefined ||
    state.search !== "";

  const formattedRole = authorInfo?.role
    ? authorInfo.role.toLowerCase().replace(/^./, (c) => c.toUpperCase())
    : "";

  const role = authorInfo?.role.toLowerCase() as BadgeVariant;

  //Pagination
  const totalCount = tasksCount ?? 0;
  const pageCount = Math.max(
    1,
    Math.ceil(totalCount / state.pagination.pageSize)
  );
  const handlePageChange = (newPageIndex: number) => {
    if (newPageIndex < 0 || newPageIndex >= pageCount) return;
    dispatch({
      type: "SET_PAGINATION",
      payload: { ...state.pagination, pageIndex: newPageIndex },
    });
  };
  const handlePageSizeChange = (newPageSize: number) => {
    dispatch({
      type: "SET_PAGINATION",
      payload: { pageIndex: 0, pageSize: newPageSize },
    });
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
            value={state.search}
            onChange={(e) =>
              dispatch({ type: "SET_SEARCH", payload: e.target.value })
            }
            className="w-full md:max-w-1/4 px-4 py-4 border rounded-md mb-2"
          />
          <TaskFilter
            priority={state.priority}
            setPriority={(val) =>
              dispatch({ type: "SET_PRIORITY", payload: val })
            }
            status={state.status}
            setStatus={(val) => dispatch({ type: "SET_STATUS", payload: val })}
            type={state.type}
            setType={(val) => dispatch({ type: "SET_TYPE", payload: val })}
            date={state.date}
            setDate={(val) => dispatch({ type: "SET_DATE", payload: val })}
          />

          <Button
            variant={isFiltered ? "destructive" : "muted"}
            onClick={() => dispatch({ type: "CLEAR_FILTERS" })}
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
          pageIndex={state.pagination.pageIndex}
          pageSize={state.pagination.pageSize}
          pageCount={pageCount}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          canPreviousPage={state.pagination.pageIndex > 0}
          canNextPage={state.pagination.pageIndex + 1 < pageCount}
        />
      </section>
    </main>
  );
};

export default AuthorPage;
