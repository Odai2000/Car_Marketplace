import React, { useMemo, useState } from "react";
import {
  useTable,
  flexRender,
  rowSortingFeature,
  rowSelectionFeature,
  createSortedRowModel,
  sortFn_alphanumeric,
  sortFn_text,
  tableFeatures,
  globalFilteringFeature,
  createFilteredRowModel,
  columnFilteringFeature,
  filterFn_includesString,
} from "@tanstack/react-table";
import Button from "../../UI/Button/Button";

import "./DataTable.css";

import { TiArrowSortedUp } from "react-icons/ti";
import { TiArrowSortedDown } from "react-icons/ti";

import SelectColumn from "./utility/SelectColumn";
import BulkActionsBar from "./utility/BulkActionsBar";
import Input from "../FormControls/Input";

const DataTable = ({
  columnDefs,
  data,
  searchable = true,
  sortable = true,
  rowSelection = false,
  SelectColumnComponent = rowSelection ? SelectColumn : null,
  actionSets = {},
}) => {
  const features = tableFeatures({
    ...(sortable && {
      rowSortingFeature,
      sortedRowModel: createSortedRowModel(),
      sortFns: {
        text: sortFn_text,
        alphanumeric: sortFn_alphanumeric,
      },
    }),
    ...(rowSelection && { rowSelectionFeature }),
    columnFilteringFeature,
    ...(searchable && {
      globalFilteringFeature,
      filteredRowModel: createFilteredRowModel(),
      filterFns: { includesString: filterFn_includesString },
    }),

  });

  const columns = useMemo(() => {
    if (!rowSelection) return columnDefs;
    return [SelectColumnComponent, ...columnDefs];
  }, [columnDefs, rowSelection, SelectColumnComponent]);

  const table = useTable({
    data: data,
    columns: columns,
    features,
  });

  return (
    <div className="DataTable flex-col gap-1em">
      <div className="table-controls flex gap-1em font-sm ">
        <div className="right-side flex gap-05em center">
          <Button>{`filter`}</Button>
          <Input
            placeholder={`search... `}
            value={table.state.globalFilter || ""}
            onChange={(e) => {
              table.setGlobalFilter(e.target.value);
            }}
          />
        </div>
      </div>
      <table className="DataTable data-table">
        <thead>
          <tr></tr>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  className={`${header.column.getCanSort() ? "sortable-header" : ""} font-xs`}
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                  {header.column.getIsSorted() === "asc" ? (
                    <TiArrowSortedUp />
                  ) : header.column.getIsSorted() === "desc" ? (
                    <TiArrowSortedDown />
                  ) : (
                    ""
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr
              key={row.id}
              className={
                table.getSelectedRowModel().rows.some((r) => r.id === row.id)
                  ? "selected"
                  : ""
              }
            >
              {row.getAllCells().map((cell) => (
                <td
                  key={cell.id}
                  className={`font-xs ${cell.column.columnDef.meta?.cellClassName || ""}`}
                >
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {table.getSelectedRowModel().rows.length > 0 && (
        <BulkActionsBar actionSets={actionSets} table={table}></BulkActionsBar>
      )}
    </div>
  );
};

export default DataTable;
