import { useState, useEffect } from "react";
import axios from "axios";
import Card from "../components/Card";
import AddJobForm from "../components/AddJobForm";
import { Search } from "lucide-react";

const COMPANY_INFO = {
  // name: "Google",
  // logo: "https://img.icons8.com/color/48/google-logo.png",
};

const Jobposting = () => {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [editJob, setEditJob] = useState(null);

  const API_BASE_URL = "http://localhost:3000";

  const getAxiosConfig = () => ({
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // ✅ FETCH JOBS
  const fetchJobs = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/job/myjobs`,
        getAxiosConfig()
      );

      const fetchedJobs = res.data.map((job) => ({
        ...job,
        id: job._id,
      }));

      setJobs(fetchedJobs);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // ✅ CREATE / UPDATE
  const handleSaveJob = async (jobData) => {
    try {
      const payload = {
        title: jobData.title,
        description: jobData.description,
        location: jobData.location,
        vacancies: jobData.vacancies,
        skillsrequired: jobData.skillsRequired,
      };

      if (editJob) {
        // UPDATE
        await axios.patch(
          `${API_BASE_URL}/job/update/${editJob.id}`,
          payload,
          getAxiosConfig()
        );
      } else {
        // CREATE
        await axios.post(
          `${API_BASE_URL}/job/create`,
          payload,
          getAxiosConfig()
        );
      }

      fetchJobs();
      setShowForm(false);
      setEditJob(null);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to save job");
    }
  };

  // ✅ DELETE
  const handleDeleteJob = async (jobId) => {
    if (!window.confirm("Delete this job?")) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/job/delete/${jobId}`,
        getAxiosConfig()
      );

      setJobs((prev) => prev.filter((job) => job.id !== jobId));
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  // ✅ EDIT
  const handleEditJob = (job) => {
    setEditJob(job);
    setShowForm(true);
  };

  const filteredJobs = jobs.filter((job) =>
    (job.title || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* HEADER */}
      <div style={{
        marginBottom: "30px",
        padding: "25px",
        background: "linear-gradient(135deg, rgb(20,184,166), rgb(14,165,233))",
        borderRadius: "16px",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <img src={COMPANY_INFO.logo} style={{ width: "40px" }} />
          <h1>{COMPANY_INFO.name}</h1>
        </div>

        <button
          onClick={() => {
            setEditJob(null);
            setShowForm(true);
          }}
          style={{
            background: "white",
            color: "#0ea5e9",
            padding: "10px 20px",
            borderRadius: "10px",
            border: "none",
            cursor: "pointer",
          }}
        >
          + Add Job
        </button>
      </div>

      {/* SEARCH */}
      <div style={{
        display: "flex",
        alignItems: "center",
        marginBottom: "20px",
        background: "white",
        padding: "10px",
        borderRadius: "10px",
      }}>
        <Search size={20} />
        <input
          style={{ flex: 1, border: "none", outline: "none", marginLeft: "10px" }}
          placeholder="Search jobs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* JOB GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))",
        gap: "20px",
      }}>
        {filteredJobs.map((job) => (
          <Card
            key={job.id}
            {...job}
            id={job.id}
            showDelete={true}
            onDelete={handleDeleteJob}
            onEdit={() => handleEditJob(job)}   // ✅ ADDED EDIT
          />
        ))}
      </div>

      {/* EMPTY STATE */}
      {filteredJobs.length === 0 && (
        <div style={{ textAlign: "center", marginTop: "40px" }}>
          No jobs found
        </div>
      )}

      {/* MODAL FORM */}
      {showForm && (
        <AddJobForm
          onClose={() => {
            setShowForm(false);
            setEditJob(null);
          }}
          onSave={handleSaveJob}
          initialData={editJob}   // ✅ PASS EDIT DATA
        />
      )}
    </div>
  );
};

export default Jobposting;
