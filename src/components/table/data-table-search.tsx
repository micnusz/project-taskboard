import React from "react";
import { Input } from "../ui/input";
import { Table } from "@tanstack/react-table";

interface DataTableSearchClientProps<TData> {
  table: Table<TData>;
}

const DataTableSearchClient = <TData,>({
  table,
}: DataTableSearchClientProps<TData>) => {
  return (
    <Input
      placeholder="Search"
      value={(table.getColumn("description")?.getFilterValue() as string) ?? ""}
      onChange={(event) =>
        table.getColumn("description")?.setFilterValue(event.target.value)
      }
      className="border xs:w-full sm:w-[20rem] md:w-[20rem] duration-200 ease-in-out rounded-md border-3 border-input transition-colors hover:border-chart-1"
    />
  );
};

export default DataTableSearchClient;
