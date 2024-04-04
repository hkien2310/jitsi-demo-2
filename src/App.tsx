import { useEffect } from 'react';
import './App.css';
import LoadingScreen from './component/Loading/Loading';
import cacheKeys from './const/cachedKeys';
import MainLayout from './layout/mainLayout';
import listUser from './mock/listUser.json';
import { useGet, useSave } from './store/useStores';
import AuthServices from './services/Auth.services';
import { Slide, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const rowsDemo = [
  { id: 1, name: 'Họp Daily', status: 1, description: 'Báo cáo hằng ngày' },
  { id: 2, name: 'Họp Weekly', status: 1, description: 'Báo cáo hằng tuần' },
  { id: 3, name: 'Họp Quý', status: 1, description: 'Tổng kết quý' },
  { id: 4, name: 'Họp Team', status: 1, description: 'Team báo cáo' },
  { id: 5, name: 'Họp Demo Sản phẩm', status: 1, description: 'Demo sản phẩm' },
  { id: 6, name: 'Họp Chiến Lược', status: 1, description: 'Họp chiến lược' },
];

function App() {
  const isLoadingApp = useGet(cacheKeys.LOADING_APP)
  const isLogged = useGet(cacheKeys.IS_LOGGED)
  const userInfo = AuthServices.getUserLocalStorage()
  

  const save = useSave()
  save(cacheKeys.USER_INFO, userInfo)
  
  useEffect(() => {
    save(cacheKeys.DEMO_LIST, rowsDemo)
    save(cacheKeys.DEMO_LIST_USER, listUser)
  }, [save])

  useEffect(() => {
    const assetToken = AuthServices.getToken()
    if(assetToken) {
      save(cacheKeys.IS_LOGGED, true)
    } else {
      save(cacheKeys.IS_LOGGED, false)
    }
  }, [save])
  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        style={{zIndex: 10000}}
        hideProgressBar={true}
        newestOnTop
        // closeButton={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        // toastClassName={classes.eachToast}
        transition={Slide}
      />
      <LoadingScreen isLoading={isLoadingApp || isLogged === undefined} hideScreen={isLogged === undefined}/>
      <MainLayout />
    </div>
  );
}

export default App;
