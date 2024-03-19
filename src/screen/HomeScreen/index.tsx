import { Box } from "@mui/material";
import { DataGrid, GridColDef, GridValueGetterParams } from "@mui/x-data-grid";
import React, { useState } from "react"
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CallIcon from '@mui/icons-material/Call';
import ButtonDialog from "../../component/dialog/ButtonDialog";
import AddMeeting from "./AddMetting";
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from "react-router-dom";
import queryString from "query-string";
import NavigationBar from "../../component/NavigationBar";
import { useGet, useSave } from "../../store/useStores";
import cacheKeys from "../../const/cachedKeys";
import useGetListMeeting from "../../hooks/useGetListMeeting";
import useFiltersHandler from "../../hooks/useFilters";
import AuthServices from "../../services/Auth.services";

// const rowsDemo = [
//   { id: 1, name: 'Họp Daily', status: 1, description: 'Báo cáo hằng ngày' },
//   { id: 2, name: 'Họp Weekly', status: 1, description: 'Báo cáo hằng tuần' },
//   { id: 3, name: 'Họp Quý', status: 1, description: 'Tổng kết quý' },
//   { id: 4, name: 'Họp Team', status: 1, description: 'Team báo cáo' },
//   { id: 5, name: 'Họp Demo Sản phẩm', status: 1, description: 'Demo sản phẩm' },
//   { id: 6, name: 'Họp Chiến Lược', status: 1, description: 'Họp chiến lược' },
// ];


const HomeScreen = () => {
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)
  const userInfo = AuthServices.getUserLocalStorage()
  console.log(userInfo, 'userInfo')
  // const [paginationModel, setPaginationModel] = React.useState({
  //   pageSize: 3,
  //   page: 0,
  // });
  const { filters, handleChangePage } = useFiltersHandler({ page: 0 });
  const paginationModel = React.useMemo(() => {
    return {
      pageSize: filters?.page_size,
      page: filters?.page,
    }
  }, [filters])

  const { data } = useGetListMeeting(filters)

  const save = useSave()
  const rows = useGet(cacheKeys.DEMO_LIST)

  const setRows = (value: any[]) => {
    save(cacheKeys.DEMO_LIST, value)
  }

  const columns: GridColDef[] = [
    {
      field: 'id',
      headerName: 'STT',
      width: 90,
      renderCell: (row) => {
        return <>{row.id}</>
      }
    },
    {
      field: 'title',
      headerName: 'Tên cuộc họp',
      width: 150,
      editable: false,
      sortable: false,
    },
    {
      field: 'description',
      headerName: 'Mô tả',
      width: 250,
      editable: false,
      sortable: false,
    },
    // {
    //   field: 'time',
    //   headerName: 'Thời gian bắt đầu',
    //   width: 200,
    //   editable: false,
    //   sortable: false,
    // },
    {
      field: 'status',
      headerName: 'Trạng thái',
      type: 'number',
      width: 300,
      editable: false,
      sortable: false,
      // renderCell: ({ row }) => {
      //   if (row.status === 1) {
      //     return <Box sx={{ fontWeight: 'bold', color: 'green' }}>Đang diễn ra</Box>
      //   }
      //   return <Box sx={{ fontWeight: 'bold', color: 'gray' }}>Hoàn thành</Box>
      // }
    },
    {
      field: 'action',
      headerName: 'Hành động',
      sortable: false,
      width: 300,
      renderCell: ({ row }) => {
        return <Box style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
          {`${row?.creatorId}` === `${userInfo.id}` ?
            <Box
              p={1}
              onClick={
                () => {
                  const newValue = rows?.filter((item: any) => item.id !== row.id)
                  setRows(newValue)
                }
              }
            >
              <DeleteIcon />
            </Box>
            :
            <Box sx={{ width: '24px', height: '24px' }} m={1} />
          }

          {
            `${row?.creatorId}` === `${userInfo.id}` ?
              <Box p={1} onClick={() => {
                const body = {
                  room: row?.id,
                  roomName: row?.name,
                }
                navigate(`/call?${queryString.stringify(body)}`)
              }}>
                <CallIcon />
              </Box>
              : <Box sx={{ width: '24px', height: '24px' }} m={1} />
          }
          {`${row?.creatorId}` === `${userInfo.id}` ?
            <Box
              p={1}
              ml={1}
              sx={{ backgroundColor: '#0d801c', color: 'white', borderRadius: '10px' }}
              onClick={() => {
                const newValue = rows?.map((e: any) => {
                  if (e?.id === row.id) {
                    return { ...e, status: 0 }
                  }
                  return e
                })
                setRows(newValue)
              }}>
              Hoàn Thành
            </Box> :
            null
          }
        </Box>
      }
    },
  ];

  
  const dataRows = React.useMemo(() => {
    return data?.data || []
  }, [data?.data])

  console.log(dataRows, 'dataRowsdataRows')
  

  return <NavigationBar>
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <ButtonDialog open={open} onToggle={(value) => setOpen(value)} text={
        <Box mb={1} p={1} sx={{ backgroundColor: '#945148', color: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center' }}>
          <AddIcon />
          Thêm mới cuộc họp
        </Box>
      } content={<AddMeeting onAdd={(value: any) => {
        const newValue = {
          id: rows?.length + 1,
          ...value
        }
        const result = [...rows, newValue]
        setRows(result)
        setOpen(false)
      }} />} />

    </Box>
    <DataGrid
      rows={dataRows}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: paginationModel,
        },
      }}
      onPaginationModelChange={(model) => handleChangePage(model?.page)}
      pageSizeOptions={[5]}
      checkboxSelection={false}
      disableRowSelectionOnClick
      hideFooterPagination={true} 
    />
  </NavigationBar>
}

export default HomeScreen