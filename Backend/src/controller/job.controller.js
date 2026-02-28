import job from "../../../server/src/models/job";

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