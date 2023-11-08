import { FaSuitcaseRolling, FaCalendarCheck } from "react-icons/fa";

import { useLoaderData, redirect } from "react-router-dom";
import customFetch from "../utils/customFetch";
import { toast } from "react-toastify";
import { StatItem } from "../components";
import styled from "styled-components";

export const loader = async () => {
  try {
    const response = await customFetch.get("/user/admin/app-stats");
    return response.data;
  } catch (error) {
    toast.error("You are not authorized to view this page");
    return redirect("/dashboard");
  }
};

const Admin = () => {
  const { users, jobs } = useLoaderData();
  // console.log(users, jobs);

  return (
    <AdminWrapper>
      <StatItem
        title="current users"
        count={users}
        color="#e9b949"
        bcg="#fcefc7"
        icon={<FaSuitcaseRolling />}
      />
      <StatItem
        title="total jobs"
        count={jobs}
        color="#647acb"
        bcg="#e0e8f9"
        icon={<FaCalendarCheck />}
      />
    </AdminWrapper>
  );
};

const AdminWrapper = styled.section`
  display: grid;
  row-gap: 2rem;
  @media (min-width: 768px){
    grid-template-columns: 1fr 1fr;
    column-gap: 1rem;
  }
  @media (min-width: 1120px){
    grid-template-columns: 1fr 1fr 1fr;
  }
`

export default Admin;
