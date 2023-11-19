import { toast } from "react-toastify";
import customFetch from "../utils/customFetch";
import { redirect } from "react-router-dom";

//* Without react query
// export const action = async ({ params }) => {
//   try {
//     await customFetch.delete(`/jobs/${params._id}`);
//     toast.success('Job deleted successfully');
//   } catch (error) {
//     toast.error(error?.response?.data?.msg);
//   }
//   return redirect('/dashboard/all-jobs');
// }

//* With react query
export const action = 
  (queryClient) => async ({ params }) => {
  try {
    await customFetch.delete(`/jobs/${params._id}`);
    queryClient.invalidateQueries(['jobs']);
    toast.success('Job deleted successfully');
  } catch (error) {
    toast.error(error?.response?.data?.msg);
  }
  return redirect('/dashboard/all-jobs');
}

const DeleteJob = () => {
  return (
    <div>DeleteJob</div>
  )
}

export default DeleteJob