import { Box } from '@mui/material'
import RouterList from '../navigation'
import RouterAuth from '../navigation/routerAuth'
import { useGet } from '../store/useStores'
import cacheKeys from '../const/cachedKeys'
import { useMemo } from 'react'

const MainLayout = () => {
    const isLogged = useGet(cacheKeys.IS_LOGGED)
    return <Box>
        {isLogged ?
            <RouterList />
            :
            <RouterAuth />
        }
            {/* <RouterList /> */}

    </Box>
}

export default MainLayout