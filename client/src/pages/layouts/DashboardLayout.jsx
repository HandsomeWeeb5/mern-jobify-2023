import { Outlet, redirect, useLoaderData, useNavigate, useNavigation } from 'react-router-dom'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { 
  BigSidebar, 
  Navbar, 
  SmallSidebar,
  Loading 
} from '../../components'

import { useState, createContext, useContext } from 'react'
import customFetch from '../../utils/customFetch';
const DashboardContext = createContext();

// const checkDefaultTheme = () => {
//   const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
//   document.body.classList.toggle('dark-theme', isDarkTheme);
//   return isDarkTheme;
// }
export const loader = async () => {
  try {
    const { data } = await customFetch('/user/current-user');
    return data;
  } catch (error) {
    return redirect('/');
  }
  // return "hello world";
}

const DashboardLayout = ({ isDarkThemeEnabled }) => {
  // temp
  // const user = { name: 'john' };

  const { user } = useLoaderData();
  // console.log(user);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const isPageLoading = navigation.state === 'loading';
  const [showSidebar, setShowSidebar] = useState(false);
  const [isDarkTheme, setIsDarkTheme] = useState(isDarkThemeEnabled);

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
    toast.success('Logging out...');
  };

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