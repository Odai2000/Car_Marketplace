import React, { useEffect, useMemo, useState } from "react";
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
  rowPaginationFeature,
} from "@tanstack/react-table";
import Button from "../../UI/Button/Button";

import "./DataTable.css";

import { TiArrowSortedUp } from "react-icons/ti";
import { TiArrowSortedDown } from "react-icons/ti";

import SelectColumn from "./utility/SelectColumn";
import BulkActionsBar from "./utility/BulkActionsBar";
import Input from "../FormControls/Input";
import Dropdown from "../Dropdown/Dropdown";
import Select from "../FormControls/Select";
import PaginationControls from "../PaginationControls/PaginationControls";
import FiltersCard from "@/components/pages/Dashboard/views/UsersMangerView/FiltersCard";
import useModal from "@/hooks/useModal";
import Modal from "../Modal/Modal";
import { FiFilter } from "react-icons/fi";
import Chip from "../Chip/Chip";
import { FaXmark } from "react-icons/fa6";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";

const DataTable = ({
  columnDefs,
  data,
  searchable = true,
  sortable = true,
  rowSelection = false,
  SelectColumnComponent = rowSelection ? SelectColumn : null,
  actionSets = {},
  pagination,
  page,
  pageCount,
  limit,
  setPage,
  setLimit,
  rowCount,
  limitOptions = [20, 30, 40, 50],
  onSearchChange,
  searchTerm,
  filters,
  filtersOptions,
  isLoading = false,
}) => {
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const [showFilters, setShowFilters] = useState(false);

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
    ...(pagination && { rowPaginationFeature }),
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
    manualPagination: true,
    state: {
      pagination,
    },
    rowCount: rowCount,
  });


  return (
    <div className="DataTable flex-col gap-1em">
      <div className="table-controls flex-col gap-05em font-sm ">
        <div class="toolbar flex gap-1em">
          <div className="left-side flex gap-05em center">
            {pagination ? (
              <>
                <PaginationControls
                  pageCount={pageCount}
                  pageIndex={page}
                  onChange={setPage}
                />{" "}
                <span className="flex center gap-05em">
                  Item per page{" "}
                  <Select
                    value={limit}
                    onChange={(e) => {setLimit(Number(e.target.value));setPage(0)}}
                    options={limitOptions}
                  />
                </span>
              </>
            ) : (
              ""
            )}
          </div>
          <div className="right-side flex gap-05em center">
            <Button
              onClick={() => {
                setShowFilters(true);
              }}
            >
              <FiFilter /> Filters
            </Button>
            <Input
              placeholder={`search... `}
              value={searchTerm || table.state.globalFilter || ""}
              onChange={(e) => {
                pagination && setPage(0);
                onSearchChange
                  ? onSearchChange(e.target.value)
                  : table.setGlobalFilter(e.target.value);
              }}
            />
          </div>
        </div>
        <div class="tags flex gap-05em">
          {searchTerm? <Chip>        
                      <Button
                        variant="icon"
                        onClick={() => {
                          onSearchChange(null);
                        }}
                      >
                        <FaXmark />
                      </Button>
                      Keyword: {searchTerm}</Chip>:''}
          {filtersOptions
            ? filtersOptions.map((filterOption) => {
                if (
                  filterOption.type === "text" ||
                  filterOption.type === "select"
                ) {
                  return (
                    <Chip>
                      <Button
                        variant="icon"
                        onClick={() => {
                          filterOption.onChange(null);
                        }}
                      >
                        <FaXmark />
                      </Button>
                      {filterOption?.label}:{filterOption.value}
                    </Chip>
                  );
                }

                if (
                  filterOption.type === "multiple" &&
                  filterOption?.value.length > 0
                ) {
                  return (
                    <Chip>
                      <Button
                        variant="icon"
                        onClick={() => {
                          filterOption.onChange([]);
                        }}
                      >
                        <FaXmark />
                      </Button>
                      {filterOption?.label}:{" "}
                      {filterOption?.value.join(", ").toLowerCase()}
                    </Chip>
                  );
                }

                if (filterOption.type === "numerical-range") {
                  if (filterOption?.startValue && filterOption?.endValue)
                    return (
                      <Chip>
                        <Button
                          variant="icon"
                          onClick={() => {
                            filterOption.onMinValueChange(null);
                            filterOption.onMaxValueChange(null);
                          }}
                        >
                          {" "}
                          <FaXmark />
                        </Button>
                        {filterOption?.label}:from {filterOption.startValue} to{" "}
                        {filterOption.endValue}
                      </Chip>
                    );
                  else if (filterOption?.startValue)
                    return (
                      <Chip key={filterOption.label}>
                        <Button
                          variant="icon"
                          onClick={() => {
                            filterOption.onMinValueChange(null);
                            filterOption.onMaxValueChange(null);
                          }}
                        >
                          {" "}
                          <FaXmark />
                        </Button>
                        {filterOption?.label}: more than{" "}
                        {filterOption.startValue}
                      </Chip>
                    );
                  else if (filterOption?.endValue)
                    return (
                      <Chip key={filterOption.label}>
                        <Button
                          variant="icon"
                          onClick={() => {
                            filterOption.onMinValueChange(null);
                            filterOption.onMaxValueChange(null);
                          }}
                        >
                          <FaXmark />
                        </Button>
                        {filterOption?.label}: less than {filterOption.endValue}
                      </Chip>
                    );
                }

                if (filterOption.type === "date-range") {
                  if (filterOption?.startValue && filterOption?.endValue)
                    return (
                      <Chip key={filterOption.label}>
                        <Button
                          variant="icon"
                          onClick={() => {
                            filterOption.onStartDateChange(null);
                            filterOption.onEndDateChange(null);
                          }}
                        >
                          <FaXmark />
                        </Button>
                        {filterOption?.label}: from {filterOption.startValue} to{" "}
                        {filterOption.endValue}
                      </Chip>
                    );
                  else if (filterOption?.startValue)
                    return (
                      <Chip key={filterOption.label}>
                        <Button
                          variant="icon"
                          onClick={() => {
                            filterOption.onStartDateChange(null);
                            filterOption.onEndDateChange(null);
                          }}
                        >
                          <FaXmark />
                        </Button>
                        {filterOption?.label} : after {filterOption.startValue}
                      </Chip>
                    );
                  else if (filterOption?.endValue)
                    return (
                      <Chip key={filterOption.label}>
                        {" "}
                        <Button
                          variant="icon"
                          onClick={() => {
                            filterOption.onStartDateChange(null);
                            filterOption.onEndDateChange(null);
                          }}
                        >
                          <FaXmark />
                        </Button>
                        {filterOption?.label}: before {filterOption.endValue}
                      </Chip>
                    );
                }
                return;
              })
            : ""}
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
          {!isLoading? table.getRowModel().rows.map((row) => (
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
          )): [...Array(limit)].map((_, index) => (
                    <tr key={index} className="table-skeleton__row">
                     {[...Array(table.getAllColumns().length)].map((_, i) => (
                        <td key={`s${i}`}>
                          <Skeleton width="100%" height="2.5rem" />
                        </td>
                      ))}
                    </tr>
                  ))}
        </tbody>
      </table>{" "}
      <div className="flex center" style={{ width: "100%" }}>
        {" "}
      </div>
      {table.getSelectedRowModel().rows.length > 0 && (
        <BulkActionsBar actionSets={actionSets} table={table}>
          {" "}
          {console.log(JSON.stringify(table.state, null, 2))}
        </BulkActionsBar>
      )}
      <Modal
        show={showFilters}
        onClose={() => setShowFilters(false)}
        title="Filter"
      >
        <FiltersCard filters={filtersOptions} />
      </Modal>
    </div>
  );
};

export default DataTable;
