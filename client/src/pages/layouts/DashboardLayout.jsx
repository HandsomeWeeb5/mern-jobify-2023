import { Outlet, redirect, useLoaderData, useNavigate, useNavigation } from 'react-router-dom'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { 
  BigSidebar, 
  Navbar, 
  SmallSidebar,
  Loading 
} from '../../components'

import { useState, createContext, useContext, useEffect } from 'react'
import customFetch from '../../utils/customFetch';
import { useQuery } from '@tanstack/react-query'
import { checkDefaultTheme } from '../../App'
const DashboardContext = createContext();

// const checkDefaultTheme = () => {
//   const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
//   document.body.classList.toggle('dark-theme', isDarkTheme);
//   return isDarkTheme;
// }

const userQuery = {
  queryKey: ['user'],
  queryFn: async () => {
    const { data } = await customFetch('/user/current-user');
    return data;
  }
};

//* Without React Query
// export const loader = async () => {
//   try {
//     const { data } = await customFetch('/user/current-user');
//     return data;
//   } catch (error) {
//     return redirect('/');
//   }
// }

export const loader = (queryClient) => async () => {
  try {
    return await queryClient.ensureQueryData(userQuery);
  } catch (error) {
    return redirect('/');
  }
};

const DashboardLayout = ({ queryClient }) => {
  // temp
  // const user = { name: 'john' };

  // const { user } = useLoaderData();//  <= without react query
  const { user } = useQuery(userQuery).data; //* <= with react query

  const navigate = useNavigate();
  const navigation = useNavigation();
  const isPageLoading = navigation.state === 'loading';
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(checkDefaultTheme());
  const [isAuthError, setIsAuthError] = useState(false);

  const toggleDarkTheme = () => {
    const newDarkTheme = !isDarkTheme;
    setIsDarkTheme(newDarkTheme);
    document.body.classList.toggle('dark-theme', newDarkTheme);
    localStorage.setItem('darkTheme', newDarkTheme);
  };

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  const logoutUser = async () => {
    // console.log('logout user');
    navigate('/');
    await customFetch.get('/auth/logout');
    queryClient.invalidateQueries();
    toast.success('Logging out...');
  };

  //* Axios Interceptor
  customFetch.interceptors.response.use((response) => {
    return response;
  }, (error) => {
    if (error?.response?.status === 401){
      setIsAuthError(true)
    }
    return Promise.reject(error);
  });

  useEffect(() => {
    if(!isAuthError) return;
    logoutUser(); 
  }, [isAuthError])
  // there is no token, you are going to landing page

  return (
    <DashboardContext.Provider value={{
      user,
      showSidebar,
      isDarkTheme,
      toggleDarkTheme,
      toggleSidebar,
      logoutUser
    }}>
      <DashboardWrapper>
        <main className="dashboard">
          <SmallSidebar />
          <BigSidebar />
          <div>
            <Navbar />
            <div className="dashboard-page">
              {isPageLoading ? <Loading /> : <Outlet context={{ user }}/>}
            </div>
          </div>
        </main>
      </DashboardWrapper>
    </DashboardContext.Provider>
  )
}

export const useDashboardContext = () => useContext(DashboardContext);

const DashboardWrapper = styled.section`
  .dashboard {
    display: grid;
    grid-template-columns: 1fr;
  }
  .dashboard-page {
    width: 90vw;
    margin: 0 auto;
    padding: 2rem 0;
  }
  @media (min-width: 992px) {
    .dashboard {
      grid-template-columns: auto 1fr;
    }
    .dashboard-page {
      width: 90%;
    }
  }
`;

export default DashboardLayout