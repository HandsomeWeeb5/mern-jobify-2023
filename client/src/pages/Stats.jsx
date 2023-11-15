import { ChartsContainer, StatsContainer } from '../components';
import customFetch from '../utils/customFetch';
// import { useLoaderData } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

const statsQuery = {
  queryKey: ['stats'],
  queryFn: async () => {
    const response = await customFetch.get('/jobs/stats');
    return response.data;
  }
}

//* Without react query
// export const loader = async () => {
//   try {
//     const response = await customFetch.get('/jobs/stats');
//     return response.data;
//   } catch (error) {
//     return error;
//   }
//   const response = await customFetch.get('/jobs/stats');
//   return response.data;
// }

//* With react query
export const loader = (queryClient) => async () => {
  const data = await queryClient.ensureQueryData(statsQuery);
  return data;
}

const Stats = () => {
  //* Without React Query
  // const { defaultStats, monthlyApplications } = useLoaderData();
  // return (
  //   <>
  //     <StatsContainer defaultStats={defaultStats} />
  //     {monthlyApplications?.length > 1 && (
  //       <ChartsContainer data={monthlyApplications} />
  //     )} 
  //   </>
  // )

  //* with React Query
  const { data } = useQuery(statsQuery);
  const { defaultStats, monthlyApplications } = data;

  return (
    <>
      <StatsContainer defaultStats={defaultStats} />
      {monthlyApplications?.length > 1 && (
        <ChartsContainer data={monthlyApplications} />
      )} 
    </>
  )
}

export default Stats