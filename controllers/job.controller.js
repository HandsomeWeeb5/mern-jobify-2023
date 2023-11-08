import { StatusCodes } from "http-status-codes";
import mongoose from "mongoose";

// job schema
import Job from "../models/job.model.js";
// import { NotFoundError } from "../errors/customError.js";
import day from "dayjs";

// GET ALL JOBS
export const getAllJobs = async (req, res) => {
  // console.log(req.query);
  const { search, jobStatus, jobType, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  }

  if(search){
    queryObject.$or = [
      { position: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } },
    ];
  }

  if (jobStatus && jobStatus !== 'all'){
    queryObject.jobStatus = jobStatus;
  }
  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType;
  }

  const sortOptions = {
    newest: '-createdAt',
    oldest: 'createdAt',
    'a-z': 'position',
    'z-a': '-position',
  };

  const sortKey = sortOptions[sort] || sortOptions.newest;

  // Pagination Setup
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const jobs = await Job.find(queryObject).sort(sortKey).skip(skip).limit(limit);
  //* in mongoDB, skip and limit method can be used for PAGINATION with mongoose. Also those two can be chained method
  const totalJobs = await Job.countDocuments(queryObject);
  const numOfPages = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ totalJobs, numOfPages, currentPage: page, jobs });
};

// CREATE JOB
export const createJob = async (req, res) => {
  // const { company, position } = req.body;
  req.body.createdBy = req.user.userId;
  const job = await Job.create(req.body);
  res.status(StatusCodes.CREATED).json({ job });
};

// GET SINGLE DATA JOB
export const getSingleJob = async (req, res) => {
  const { id } = req.params;
  const job = await Job.findById(id);
  // if(!job) {
  //   return res.status(StatusCodes.NOT_FOUND).json({ msg: `'Data id: ${id} is not found'` })
  // }
  res.status(StatusCodes.OK).json({ job });
};

// UPDATE DATA
export const updateSingleJob = async (req, res) => {
  const { id } = req.params;
  const updatedJob = await Job.findByIdAndUpdate(id, req.body, {
    new: true,
  });
  // if(!updatedJob) throw new NotFoundError(`'Job no found with ${id}'`);

  res.status(StatusCodes.OK).json({ msg: "Data updated!", updatedJob });
};

// DELETE DATA
export const deleteSingleJob = async (req, res) => {
  const { id } = req.params;
  const deletedJobs = await Job.findByIdAndDelete(id);

  res.status(StatusCodes.OK).json({ msg: "Data deleted", job: deletedJobs });
};

export const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: "$jobStatus", count: { $sum: 1 } } },
  ]);
  console.log(stats);
  stats = stats.reduce((acc, curr) => {
    const { _id: title, count } = curr;
    acc[title] = count;
    return acc;
  }, {});
  // console.log(stats);
  // temp
  const defaultStats = {
    pending: stats.pending || 0,
    interview: stats.interview || 0,
    declined: stats.declined || 0,
  };
  let monthlyApplications = await Job.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(req.user.userId),
      },
    },
    {
      $group: {
        _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);
  monthlyApplications = monthlyApplications.map((item) => {
    const {
      _id: { year, month },
      count,
    } = item;

    const date = day()
      .month(month - 1)
      .year(year)
      .format("MMM YY");

    return { date, count };
  }).reverse();

  // let monthlyApplications = [
  //   {
  //     date: 'May 23',
  //     count: 12
  //   },
  //   {
  //     date: 'Jun 23',
  //     count: 9
  //   },
  //   {
  //     date: 'Jul 23',
  //     count: 3
  //   }
  // ]
  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
