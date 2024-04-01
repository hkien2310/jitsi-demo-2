import { Box } from '@mui/material'
import RouterList from '../navigation'
import RouterAuth from '../navigation/routerAuth'
import { useGet } from '../store/useStores'
import cacheKeys from '../const/cachedKeys'
import AppThemeProvider from '../provider/AppThemeProvider'

const MainLayout = () => {
    const isLogged = useGet(cacheKeys.IS_LOGGED)
    return (
        <AppThemeProvider>
            <Box>
                {isLogged ?
                    <RouterList />
                    :
                    <RouterAuth />
                }
                    {/* <RouterList /> */}

            </Box>
        </AppThemeProvider>
    )
}

export default MainLayout