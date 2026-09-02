import job from "../models/job.model.cjs";

const getAllJobs = async (req, res) => {
    try{
        const jobs = await job.find().populate("createdBy" , "name email").sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            data: jobs,
            count : jobs.length,
        });

    }catch(err){
        res.status(500).json({
            success: false,
            message: "Server Error",
            error: err.message,
        }); 
    }
}



export { getAllJobs };

export const getJobById = async (req, res) => {
  try {
    console.log("Job ID:", req.params.jobId);

    const Job = await job.findById(req.params.jobId);

    console.log("Job:", Job);

    if (!Job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    return res.status(200).json(Job);
  } catch (error) {
    console.error("GET JOB ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};