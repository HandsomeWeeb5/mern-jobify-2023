import { createBrowserRouter, RouterProvider } from 'react-router-dom';

// react query package
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import {
  HomeLayout,
  Register,
  Login,
  DashboardLayout,
  Error,
  Landing,
  Admin,
  AddJob,
  Stats,
  AllJobs,
  Profile,
  EditJob
} from './pages';

import { action as registerAction } from "./pages/Register";
import { action as loginAction } from './pages/Login';
import { action as addJobAction } from './pages/AddJob';
import { loader as dashboardLoader } from './pages/layouts/DashboardLayout';
import { loader as allJobsLoader } from './pages/AllJobs';
import { loader as editJobLoader } from './pages/EditJob';
import { action as editJobAction } from './pages/EditJob';
import { action as deleteJobAction } from './pages/DeleteJob';
import { loader as adminLoader } from './pages/Admin';
import { action as profileAction } from './pages/Profile';
import { loader as statsLoader } from './pages/Stats';
import ErrorElement from './components/ErrorElement';

export const checkDefaultTheme = () => {
  const isDarkTheme = localStorage.getItem('darkTheme') === 'true';
  document.body.classList.toggle('dark-theme', isDarkTheme);
  return isDarkTheme;
}

checkDefaultTheme();

// query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5
    }
  }
})

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Landing />
      },
      {
        path: 'register',
        element: <Register />,
        action: registerAction
      },
      // {
      //   path: 'login',
      //   element: <Login />,
      //   action: loginAction
      // },
      {
        //* With react query
        path: 'login',
        element: <Login />,
        action: loginAction(queryClient)
      },
      {
        // path: 'dashboard',
        // loader: dashboardLoader,
        // element: <DashboardLayout isDarkThemeEnabled={isDarkThemeEnabled} />,
        //* With React query
        path: 'dashboard',
        loader: dashboardLoader(queryClient),
        element: <DashboardLayout queryClient={queryClient}/>,
        children: [
          // {
          //   index: true,
          //   element: <AddJob />,
          //   action: addJobAction
          // },
          {
            index: true,
            element: <AddJob />,
            action: addJobAction(queryClient),
            errorElement: <ErrorElement />
          },
          // {
          //   path: 'stats',
          //   element: <Stats />,
          //   loader: statsLoader,
          //   errorElement: <ErrorElement />
          // },
          {
            path: 'stats',
            element: <Stats />,
            loader: statsLoader(queryClient),
            errorElement: <ErrorElement />
          },
          // {
          //   path: 'all-jobs',
          //   element: <AllJobs />,
          //   loader: allJobsLoader,
          // },
          {
            path: 'all-jobs',
            element: <AllJobs />,
            loader: allJobsLoader(queryClient),
            errorElement: <ErrorElement />
          },
          {
            path: 'profile',
            element: <Profile />,
            action: profileAction
          },
          {
            path: 'admin',
            element: <Admin />,
            loader: adminLoader
          },
          {
            path: 'edit-job/:_id',
            element: <EditJob />,
            loader: editJobLoader(queryClient),
            action: editJobAction(queryClient)
          },
          { 
            path: 'delete-job/:_id',
            action: deleteJobAction(queryClient) 
          }
        ]
      }
    ]
  },
])

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router}/>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
