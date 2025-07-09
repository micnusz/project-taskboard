import { DataTableSkeleton } from "@/components/table/data-table-skeleton";

export default function Loading() {
  return (
    <div className="px-fluid py-fluid">
      <DataTableSkeleton
        columnCount={7}
        searchCount={1}
        filterCount={2}
        cellWidths={[
          "1rem",
          "3rem",
          "7rem",
          "4rem",
          "4rem",
          "4rem",
          "6rem",
          "3rem",
        ]}
        shrinkZero
        className="p-0 md:p-0 md:mt-0 m-0"
      />
    </div>
  );
}
