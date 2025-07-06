import { DataTableSkeleton } from "@/components/table/data-table-skeleton";

export default function Loading() {
  return (
    <div className="px-fluid py-fluid">
      <DataTableSkeleton
        columnCount={9}
        searchCount={1}
        filterCount={2}
        cellWidths={[
          "4rem",
          "15rem",
          "10rem",
          "4rem",
          "4rem",
          "4rem",
          "4rem",
          "4rem",
          "4rem",
        ]}
        shrinkZero
      />
    </div>
  );
}
