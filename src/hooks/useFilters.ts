import React, { useCallback } from "react";
import { cloneDeep, filter, isArray } from "lodash";
function useFiltersHandler(initialFilters: any) {
  const [filters, setFilters] = React.useState<any>(initialFilters);
  const [rowsSelected, setRowsSelected] = React.useState<(string | number)[]>([]);

  const handleChangePage = (value: number) => {
    setFilters((prev: object) => {
      return {
        ...prev,
        page: value,
      };
    });
  };

  const resetToInitialFilters = useCallback(() => {
    setFilters(cloneDeep(initialFilters));
  }, [initialFilters]);

  const handleSelectAll = useCallback((data: any) => {
    setRowsSelected((prev) => {
      if (isArray(prev) && prev.length === data.length) {
        return [];
      }
      return data;
    });
  }, []);

  const handleSelectOne = useCallback((data: any) => {
    setRowsSelected((prev) => {
      if (isArray(prev)) {
        const foundIndex = prev.findIndex((elm: any) => elm?.id === data?.id);
        if (foundIndex !== -1) {
          const nextSelectedRow = cloneDeep(prev);
          nextSelectedRow.splice(foundIndex, 1);
          return nextSelectedRow;
        } else {
          return [...prev, data];
        }
      }
      return prev;
    });
  }, []);
  //   const handleCheckBox = useCallback((row: RowCommon) => {
  //     setRowsSelected((selected) => {
  //       if (selected.includes(row.id)) {
  //         return cloneDeep(selected).filter((el) => el !== row.id);
  //       }
  //       return uniq([...selected, row.id]);
  //     });
  //   }, []);
  //   const handleRequestSort = (
  //     event: React.MouseEvent<unknown>,
  //     sortField: string | number | symbol
  //   ) => {
  //     setFilters((prev) => {
  //       const nextFilters = cloneDeep(prev);
  //       if (nextFilters) {
  //         if ('sortOrder' in nextFilters) {
  //           const isAsc = nextFilters.sortOrder === Order.asc;
  //           nextFilters['sortOrder'] = isAsc ? Order.desc : Order.asc;
  //         }
  //         if ('sortField' in nextFilters) {
  //           nextFilters['sortField'] = sortField;
  //         }
  //       }
  //       return nextFilters;
  //     });
  //   };
  //   const handleSearch = useCallback((nextFilters: InitialFiltersSearch<T>) => {
  //     const nextFiltersTemp = cloneDeep(nextFilters);
  //     if ('page' in nextFiltersTemp) {
  //       nextFiltersTemp['page'] = START_PAGE;
  //     }
  //     setFilters(nextFiltersTemp);
  //   }, []);
  return {
    filters,
    rowsSelected,
    setRowsSelected,
    setFilters,
    resetToInitialFilters,
    handleSelectAll,
    handleSelectOne,
    handleChangePage,
    // handleRequestSort,
    // handleSearch,
  };
}
export default useFiltersHandler;
