"use client";

import { useQuery } from "@tanstack/react-query";
import { User } from "../../../prisma/prisma";
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
import { useCallback, useEffect, useMemo, useReducer } from "react";
import debounce from "lodash.debounce";
import { Input } from "../ui/input";
import DataTableFilters from "../table/data-table-filters";
import { Button } from "../ui/button";
import { getColumns } from "../table/columns";
import { HomePageAction, HomePageState, TaskWithAuthor } from "@/lib/types";
import { ListTodo, Loader2 } from "lucide-react";

const initialState: HomePageState = {
  pagination: { pageIndex: 0, pageSize: 10 },
  search: "",
  queryText: "",
  priority: undefined,
  status: undefined,
  type: undefined,
  date: undefined,
  sortField: "createdAt",
  sortOrder: "desc",
  author: undefined,
  open: false,
};

const reducer = (
  state: HomePageState,
  action: HomePageAction
): HomePageState => {
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
    case "SET_SORT":
      return {
        ...state,
        sortField: action.payload.field,
        sortOrder: action.payload.order,
      };
    case "SET_AUTHOR":
      return { ...state, author: action.payload };
    case "SET_OPEN":
      return { ...state, open: action.payload };
    case "CLEAR_FILTERS":
      return {
        ...state,
        priority: undefined,
        status: undefined,
        type: undefined,
        date: undefined,
        author: undefined,
        search: "",
      };
    default:
      return state;
  }
};

const HomeClientPage = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const offset = state.pagination.pageIndex * state.pagination.pageSize;
  const limit = state.pagination.pageSize;

  //Get Tasks
  const { data, isLoading } = useQuery<TaskWithAuthor[]>({
    queryKey: [
      "tasks",
      state.queryText,
      limit,
      offset,
      state.priority,
      state.status,
      state.type,
      state.date,
      state.sortField,
      state.sortOrder,
      state.author?.id,
    ],
    queryFn: () =>
      searchTask(
        state.queryText,
        limit,
        offset,
        state.priority,
        state.status,
        state.type,
        state.date,
        state.sortField,
        state.sortOrder,
        state.author?.id
      ),
  });
  //Get Tasks count
  const { data: tasksCount, isLoading: taskCountIsLoading } = useQuery<number>({
    queryKey: [
      "task-count",
      state.queryText,
      state.priority,
      state.status,
      state.type,
      state.date,
      state.author?.id,
    ],
    queryFn: () =>
      getTaskCount(
        state.queryText,
        state.priority,
        state.status,
        state.type,
        state.date,
        state.author?.id
      ),
  });
  //Get users
  const { data: userData } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: () => getAuthors(),
  });

  const setSort = useCallback(
    (field: string) => {
      const isSame = state.sortField === field;
      let nextOrder: "asc" | "desc";

      if (!isSame) {
        nextOrder = "desc";
      } else if (state.sortOrder === "desc") {
        nextOrder = "asc";
      } else {
        nextOrder = "desc";
      }

      dispatch({
        type: "SET_SORT",
        payload: {
          field,
          order: nextOrder,
        },
      });
    },
    [state.sortField, state.sortOrder]
  );

  const columns = useMemo(
    () =>
      getColumns({
        sortField: state.sortField,
        sortOrder: state.sortOrder,
        setSort,
      }),
    [state.sortField, state.sortOrder, setSort]
  );

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

  //Clear button filter
  const isFiltered =
    state.priority !== undefined ||
    state.status !== undefined ||
    state.type !== undefined ||
    state.date !== undefined ||
    state.author !== undefined ||
    state.search !== "";

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
    <main className="px-fluid py-fluid">
      <div>
        <div className="flex flex-col gap-x-2">
          <div className="flex flex-row gap-x-2">
            <Input
              type="text"
              placeholder="Search"
              value={state.search}
              onChange={(e) =>
                dispatch({ type: "SET_SEARCH", payload: e.target.value })
              }
              className="w-full md:max-w-1/4 px-4 py-4 border rounded-md mb-2"
            />
            <div>
              <Button
                className="w-fit"
                variant={isFiltered ? "destructive" : "muted"}
                onClick={() => dispatch({ type: "CLEAR_FILTERS" })}
              >
                Clear
              </Button>
            </div>
          </div>
          <div className="flex flex-row gap-x-2 mb-2 flex-wrap ">
            <div>
              <DataTableFilters
                userData={userData ?? []}
                priority={state.priority}
                setPriority={(val) =>
                  dispatch({ type: "SET_PRIORITY", payload: val })
                }
                status={state.status}
                setStatus={(val) =>
                  dispatch({ type: "SET_STATUS", payload: val })
                }
                type={state.type}
                setType={(val) => dispatch({ type: "SET_TYPE", payload: val })}
                date={state.date}
                setDate={(val) => dispatch({ type: "SET_DATE", payload: val })}
                author={state.author}
                setAuthor={(val) =>
                  dispatch({ type: "SET_AUTHOR", payload: val })
                }
              />
            </div>

            <div>
              <Dialog
                open={state.open}
                onOpenChange={(val) =>
                  dispatch({ type: "SET_OPEN", payload: val })
                }
              >
                <DialogTrigger asChild>
                  <Button variant="outline">Add Task</Button>
                </DialogTrigger>
                <DialogContent className="min-h-[20rem] max-h-screen">
                  <DialogHeader>
                    <DialogTitle>Create Task:</DialogTitle>
                    <div>
                      <Form
                        onSuccess={() =>
                          dispatch({ type: "SET_OPEN", payload: false })
                        }
                      />
                    </div>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
            <div className="ml-auto">
              <Button
                variant="ghost"
                className="ml-auto cursor-default"
                disabled
              >
                <ListTodo className="w-4 h-4 mr-2" />
                {taskCountIsLoading ? (
                  <Loader2 className="animate-spin w-4 h-4" />
                ) : (
                  `Count: ${tasksCount}`
                )}
              </Button>
            </div>
          </div>
        </div>
        <DataTable
          columns={columns}
          data={data ?? []}
          isLoading={isLoading}
          pagination={{
            pageIndex: state.pagination.pageIndex,
            pageSize: state.pagination.pageSize,
            pageCount: pageCount,
            onPageChange: handlePageChange,
            onPageSizeChange: handlePageSizeChange,
            canPreviousPage: state.pagination.pageIndex > 0,
            canNextPage: state.pagination.pageIndex + 1 < pageCount,
          }}
        />
      </div>
    </main>
  );
};

export default HomeClientPage;
