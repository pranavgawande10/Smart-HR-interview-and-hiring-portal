import { useState, useEffect } from "react";
import {
  Mail,
  Briefcase,
  Edit2,
  Save,
  X,
  Plus,
  Camera,
} from "lucide-react";
import axios from "axios";
import { SKILLS_LIST } from "../../constants/skillsConstant";
import { motion, AnimatePresence } from "framer-motion";

const CandidateProfile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Loading...",
    email: "Loading...",
    experienceYears: 0,
    skills: [],
    profilePhoto: "",
  });

  const [editedProfile, setEditedProfile] = useState(profile);
  const [newSkill, setNewSkill] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axios.get(
        "http://localhost:3001/api/v1/candidates/current-user",
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const user =
        res.data.message ||
        res.data.data ||
        res.data.user ||
        res.data;

      const profileData = {
        name: user.name || "Unknown",
        email: user.email || "",
        experienceYears: user.experienceYears || 0,
        skills: user.skills || [],
        profilePhoto: user.profilePhoto || "",
      };

      setProfile(profileData);
      setEditedProfile(profileData);
      setPhotoPreview(profileData.profilePhoto);
    } catch (err) {
      console.error("Error fetching profile", err);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setSelectedPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    // Upload profile photo if selected
    if (selectedPhoto) {
      try {
        const formData = new FormData();
        formData.append("profilePhoto", selectedPhoto);

        await axios.patch(
          "http://localhost:3001/api/v1/candidates/update-profile-photo",
          formData,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } catch (err) {
        console.error("Error updating profile photo", err);
        alert("Failed to update profile photo. Ensure Cloudinary is configured.");
      }
    }

    try {
      // Update profile details
      await axios.put(
        "http://localhost:3001/api/v1/candidates/profile",
        {
          name: editedProfile.name,
          email: editedProfile.email,
          experienceYears: Number(
            editedProfile.experienceYears
          ),
          skills: editedProfile.skills,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      await fetchProfile();

      setSelectedPhoto(null);
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile", err);
      const errorMessage = err.response?.data?.message || err.message || "Unknown error";
      alert(`Failed to update profile: ${errorMessage}`);
    }
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setPhotoPreview(profile.profilePhoto);
    setSelectedPhoto(null);
    setIsEditing(false);
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;

    if (editedProfile.skills.includes(newSkill.trim())) {
      setNewSkill("");
      return;
    }

    setEditedProfile({
      ...editedProfile,
      skills: [...editedProfile.skills, newSkill.trim()],
    });

    setNewSkill("");
  };

  const removeSkill = (index) => {
    setEditedProfile({
      ...editedProfile,
      skills: editedProfile.skills.filter((_, i) => i !== index),
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto p-4 sm:p-6 text-slate-100"
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold m-0 outfit-font">
            My Profile
          </h1>
          <p className="text-slate-400 mt-1">
            Manage your account details
          </p>
        </div>

        {!isEditing ? (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="bg-gradient-to-r from-teal-500 to-sky-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-sky-500/20 transition-all border-none cursor-pointer"
          >
            <Edit2 size={16} />
            Edit Profile
          </motion.button>
        ) : (
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCancel}
              className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-200 px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 transition-all border border-slate-600 cursor-pointer"
            >
              <X size={16} />
              Cancel
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleSave}
              className="bg-gradient-to-r from-teal-500 to-sky-500 text-white px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-sky-500/20 transition-all border-none cursor-pointer"
            >
              <Save size={16} />
              Save Changes
            </motion.button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Card */}
        <motion.div 
          className="md:col-span-4 glass-card rounded-2xl p-8 border border-slate-700/50 flex flex-col items-center relative overflow-hidden"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          {/* Animated background blobs */}
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-32 h-32 bg-teal-500 rounded-full blur-[60px] opacity-20 animate-blob"></div>

          {/* Profile Photo */}
          <div className="relative w-32 h-32 mb-6 group">
            <img
              src={
                photoPreview ||
                "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-slate-700/50 shadow-xl bg-slate-800"
            />

            {isEditing && (
              <>
                <input
                  type="file"
                  accept="image/*"
                  id="profilePhotoInput"
                  onChange={handlePhotoChange}
                  className="hidden"
                />

                <label
                  htmlFor="profilePhotoInput"
                  className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-sky-500 text-white flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform"
                >
                  <Camera size={18} />
                </label>
              </>
            )}
          </div>

          <div className="w-full text-center">
            {isEditing ? (
              <input
                className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white text-center font-semibold text-lg focus:outline-none focus:border-sky-500 transition-colors"
                value={editedProfile.name}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    name: e.target.value,
                  })
                }
              />
            ) : (
              <h2 className="text-2xl font-bold outfit-font mb-1">{profile.name}</h2>
            )}
            {!isEditing && <p className="text-sky-400 text-sm font-medium">Candidate</p>}
          </div>

          <div className="w-full h-px bg-slate-700/50 my-6"></div>

          <div className="w-full flex flex-col gap-4 text-slate-300">
            <EditableRow
              icon={Mail}
              value={
                isEditing
                  ? editedProfile.email
                  : profile.email
              }
              isEditing={isEditing}
              onChange={(val) =>
                setEditedProfile({
                  ...editedProfile,
                  email: val,
                })
              }
            />
          </div>
        </motion.div>

        {/* Right Card */}
        <motion.div 
          className="md:col-span-8 glass-card rounded-2xl p-8 border border-slate-700/50"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-700/50">
            <div className="p-2 bg-sky-500/10 rounded-lg">
              <Briefcase size={22} className="text-sky-400" />
            </div>
            <h3 className="text-xl font-bold outfit-font m-0">Professional Details</h3>
          </div>

          <div className="mb-8">
            <p className="text-slate-400 text-sm mb-2 font-medium">Experience (Years)</p>

            {isEditing ? (
              <input
                type="number"
                className="w-32 bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sky-500 transition-colors"
                value={editedProfile.experienceYears}
                onChange={(e) =>
                  setEditedProfile({
                    ...editedProfile,
                    experienceYears: e.target.value,
                  })
                }
              />
            ) : (
              <strong className="text-lg text-slate-100 block bg-slate-800/30 border border-slate-700/30 rounded-lg px-4 py-2 w-max">
                {profile.experienceYears} {profile.experienceYears === 1 ? 'Year' : 'Years'}
              </strong>
            )}
          </div>

          {/* Skills */}
          <div>
            <h4 className="text-slate-400 text-sm mb-3 font-medium">
              Skills
            </h4>

            <div className="flex flex-wrap gap-2 mb-4">
              <AnimatePresence>
                {(isEditing
                  ? editedProfile.skills
                  : profile.skills
                ).map((skill, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="bg-slate-800 border border-slate-600 text-slate-200 px-4 py-1.5 rounded-full flex items-center gap-2 text-sm font-medium shadow-sm"
                  >
                    {skill}

                    {isEditing && (
                      <span
                        onClick={() => removeSkill(index)}
                        className="cursor-pointer font-bold text-slate-400 hover:text-red-400 transition-colors w-4 h-4 flex items-center justify-center rounded-full hover:bg-slate-700"
                      >
                        ×
                      </span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {isEditing && (
              <div className="flex gap-3 items-start max-w-md">
                <div className="relative flex-1">
                  <input
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-sky-500 transition-colors"
                    value={newSkill}
                    placeholder="Type or select a skill"
                    onChange={(e) => {
                      setNewSkill(e.target.value);
                      setShowDropdown(true);
                    }}
                    onFocus={() => setShowDropdown(true)}
                    onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  />
                  {showDropdown && (
                    <div 
                      className="absolute top-full left-0 right-0 bg-slate-800 border border-slate-600 rounded-lg mt-1 z-10 shadow-xl overflow-y-auto custom-scrollbar"
                      style={{ maxHeight: "190px" }} /* Approx 5 items (38px per item) */
                    >
                      {SKILLS_LIST.filter(s => s.toLowerCase().includes(newSkill.toLowerCase())).length > 0 ? (
                        SKILLS_LIST.filter(s => s.toLowerCase().includes(newSkill.toLowerCase())).map((skill, idx) => (
                          <div
                            key={idx}
                            className="px-4 py-2 cursor-pointer border-b border-slate-700/50 text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors h-[38px] flex items-center"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              if (!editedProfile.skills.includes(skill)) {
                                setEditedProfile({
                                  ...editedProfile,
                                  skills: [...editedProfile.skills, skill],
                                });
                              }
                              setNewSkill("");
                              setShowDropdown(false);
                            }}
                          >
                            {skill}
                          </div>
                        ))
                      ) : (
                        <div className="px-4 py-2 h-[38px] flex items-center text-sm text-slate-400 italic">
                          Press Add to create custom skill
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={addSkill}
                  className="bg-gradient-to-r from-teal-500 to-sky-500 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center gap-1 hover:shadow-lg hover:shadow-sky-500/20 transition-all border-none cursor-pointer h-10"
                >
                  <Plus size={16} />
                  Add
                </button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

const EditableRow = ({
  icon: Icon,
  value,
  isEditing,
  onChange,
}) => (
  <div className="flex items-center gap-3 w-full bg-slate-800/30 p-3 rounded-xl border border-slate-700/30">
    <div className="text-slate-400">
      <Icon size={18} />
    </div>

    {isEditing ? (
      <input
        className="flex-1 bg-slate-800/50 border border-slate-600 rounded-md px-3 py-1.5 text-white focus:outline-none focus:border-sky-500 transition-colors text-sm"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    ) : (
      <span className="text-sm font-medium">{value}</span>
    )}
  </div>
);

export default CandidateProfile;