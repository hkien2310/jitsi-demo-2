import AddIcon from "@mui/icons-material/Add";
import { Box } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { FastField, Form, Formik, FormikProps } from "formik";
import * as React from "react";
import { ImageSource } from "../../assets/Image";
import PaginationRounded from "../../component/Pagination";
import { colors } from "../../const/colors";
import { calculateTotalPages, generateMessage } from "../../helper/function";
import ButtonCommon from "../Button";
import TextField from "../TextField";
import { CustomNoRowsOverlay } from "./component/NoRows";

interface ITableFilterSearch {
  columns: GridColDef[];
  dataRows: any[];
  rowCount: number;
  loading?: boolean;
  onSearchAndFilter: (
    values: {
      search: string;
      status: string;
    },
    filter: {
      pageSize: any;
      page: any;
    }
  ) => void;
  onClickRight?: () => void;
  rightTitle?: string;
  searchPlaceholder?: string;
  filterComponent?: (
    formikProps: FormikProps<{
      search: string;
      status: string;
    }>
  ) => React.ReactNode;
  filters: any
  handleChangePage: (page: number) => void
}

const TableFilterSearch = (props: ITableFilterSearch) => {
  const {
    columns,
    dataRows,
    rowCount,
    onSearchAndFilter,
    onClickRight,
    rightTitle,
    searchPlaceholder,
    filterComponent,
    filters,
    handleChangePage,
    loading,
    ...remainProps
  } = props;
  // const { filters, handleChangePage } = useFiltersHandler({
  //   page: 0,
  //   perPage: 10,
  // });

  const paginationModel = React.useMemo(() => {
    return {
      pageSize: filters?.perPage,
      page: filters?.page,
    };
  }, [filters]);
  // const loadingCVT = React.useMemo(() => {
  //   setTimeout(() => {
  //     return Boolean(loading)
  //   }, 100)
  // }, [loading])

  return (
    <Box>
      <Formik
        initialValues={{
          search: "",
          status: "",
        }}
        onSubmit={(values) => onSearchAndFilter(values, filters)}
      >
        {(formikProps) => {
          return (
            <Form>
              <Box
                sx={{
                  justifyContent: "space-between",
                  flex: 1,
                  display: "flex",
                }}
                mb={2}
              >
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <FastField
                    style={{ width: 400 }}
                    size="medium"
                    id={"search"}
                    component={TextField}
                    name={"search"}
                    placeholder={searchPlaceholder}
                    fullWidth
                  />
                  <ButtonCommon
                    variant="contained"
                    color="secondary"
                    // type="submit"
                    onClick={() => formikProps.handleSubmit()}
                    sx={{ height: "56px", width: "56px", ml: "20px" }}
                  >
                    <img
                      src={ImageSource.searchIcon}
                      style={{ width: "28px", height: "28px" }}
                      alt={""}
                    />
                  </ButtonCommon>
                  <Box ml={3} sx={{ height: "100%" }}>
                    {filterComponent && filterComponent(formikProps)}
                  </Box>
                </Box>
                {onClickRight && rightTitle && (
                  <Box>
                    <ButtonCommon
                      variant="contained"
                      sx={{
                        height: "56px",
                        padding: "14px 16px",
                        borderRadius: 2,
                      }}
                      startIcon={<AddIcon />}
                      onClick={onClickRight}
                    >
                      {rightTitle}
                    </ButtonCommon>
                  </Box>
                )}
              </Box>
            </Form>
          );
        }}
      </Formik>
      <Box sx={{
        // height: 
        //   loading ? 200 :
        //   (dataRows?.length === 0 ? 400 : undefined )
        height: (dataRows?.length === 0 ? 400 : undefined)
      }}
      >
        <DataGrid
          rows={dataRows}
          columns={columns}
          rowSpacingType={"margin"}
          hideFooter
          initialState={{
            pagination: {
              paginationModel: paginationModel,
            },
          }}
          paginationMode="server"
          sortingMode="server"
          rowCount={rowCount}
          // onPaginationModelChange={(model) => handleChangePage(model?.page)}
          pageSizeOptions={[5]}
          checkboxSelection={false}
          disableRowSelectionOnClick
          disableColumnFilter
          disableColumnMenu
          disableColumnSelector
          columnBuffer={10}
          // hideFooterPagination={true}
          slots={{
            noRowsOverlay: CustomNoRowsOverlay,
            // loadingOverlay: LoadingTable
          }}
          // loading={loadingCVT}
          sx={{
            textAlign: "center",
            color: colors.text.tableContent,
            "& .MuiDataGrid-columnHeaders": {
              // background: blue["A100"],
              "& .MuiDataGrid-columnSeparator": {
                display: "none",
              },
              background: colors.background.tableHeader,
              color: "black",
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: "600",
              },
            },
          }}
        />

      </Box>
      <Box sx={{ textAlign: 'left', color: colors.text.tableRowCount, fontSize: '14px', }} py={1}>
        {generateMessage(dataRows || [], (filters.page || 0) + 1, (filters.perPage || 0), (rowCount || 0))}
      </Box>
      <Box
        sx={{ display: "flex", justifyContent: "center", width: "100%" }}
        p={1}
      >
        <PaginationRounded
          totalPage={calculateTotalPages(rowCount || 0, filters.perPage)}
          page={filters.page + 1}
          handleChangePage={(page) => handleChangePage(page - 1)}
        />
      </Box>
    </Box>
  );
};

export default TableFilterSearch;
