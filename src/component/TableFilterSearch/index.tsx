import AddIcon from "@mui/icons-material/Add";
import { Box, Grid } from "@mui/material";
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
import cacheKeys from "../../const/cachedKeys";
import { DeviceType } from "../../hooks/useDivices";
import { useGet } from "../../store/useStores";

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
  const deviceType = useGet(cacheKeys.DEVICE_TYPE)
  const isMobile = React.useMemo(() => {
    return deviceType === DeviceType.MOBILE
  }, [deviceType])

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
              <Grid
                spacing={2}
                container
                sx={{
                  justifyContent: "space-between",
                  flex: 1,
                  display: "flex",
                }}
                mb={2}
              >
                <Grid item md={6} xs={12}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <FastField
                      style={{ width: 400 }}
                      size={isMobile ? "small" : "medium"}
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
                      sx={{ height: isMobile ? "40px" : "56px", width: isMobile ? "40px" : "56px", ml: "20px" }}
                    >
                      <img
                        src={ImageSource.searchIcon}
                        style={{ width: isMobile ? "20px" : "28px", height: isMobile ? "20px" :"28px" }}
                        alt={""}
                      />
                    </ButtonCommon>
                  </Box>
                </Grid>
                <Grid item md={2} xs={6}>
                  <Box sx={{ height: "100%", display: 'flex' }}>
                    {filterComponent && filterComponent(formikProps)}
                  </Box>
                </Grid>
                <Grid item md={4} xs={6}>
                  <Box sx={{display: 'flex', justifyContent: 'flex-end'}}>
                  {onClickRight && rightTitle && (
                    <Box>
                      <ButtonCommon
                        variant="contained"
                        sx={{
                          height: isMobile ? "40px" : "56px",
                          // padding: "14px 16px",
                          borderRadius: 2,
                        }}
                        startIcon={deviceType !== DeviceType.MOBILE && <AddIcon />}
                        onClick={onClickRight}
                      >
                        {deviceType === DeviceType.MOBILE ? <AddIcon /> : rightTitle}
                      </ButtonCommon>
                    </Box>
                  )}
                  </Box>
                </Grid>

              </Grid>
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
