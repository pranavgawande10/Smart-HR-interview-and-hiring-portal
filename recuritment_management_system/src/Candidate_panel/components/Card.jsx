import { Bookmark, Trash2 } from 'lucide-react';
import { useState } from "react";
import { Link } from "react-router-dom";
import ApplyForm from '../pages/ApplyForm';

const Card = (props) => {
  const [saved, setSaved] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  return (
    <>
      <div className="glass-card rounded-xl p-6 border border-slate-700/50 hover:border-slate-600 transition-all duration-300 relative group flex flex-col h-full">
        {/* TOP */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-slate-800 p-2 rounded-xl border border-slate-700">
              <img 
                src={props.brandLogo}
                alt={props.company}
                className="w-10 h-10 object-contain rounded-lg"
              />
            </div>
            <div>
              <h3 className="text-base font-semibold text-slate-100 m-0 leading-tight">
                {props.company}
              </h3>
              <p className="text-xs text-slate-400 m-0 mt-1">
                {props.datePosted}
              </p>
            </div>
          </div>
          
          <div className="flex gap-2">
            {props.showDelete && (
              <button
                onClick={() => props.onDelete(props.id)}
                className="text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg px-3 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Trash2 size={14} />
                Delete
              </button>
            )}
          </div>
        </div>

        {/* JOB TITLE */}
        <h2 className="text-xl font-bold text-slate-100 mb-3 outfit-font group-hover:text-sky-400 transition-colors line-clamp-2">
          {props.post}
        </h2>

        {/* TAGS */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <span className="bg-sky-500/10 text-sky-400 border border-sky-500/20 px-3 py-1 rounded-full text-xs font-medium">
            {props.tag1}
          </span>
          <span className="bg-slate-800 text-slate-300 border border-slate-700 px-3 py-1 rounded-full text-xs font-medium">
            {props.tag2}
          </span>
        </div>

        <div className="flex-grow"></div>

        {/* SALARY & LOCATION */}
        <div className="flex justify-between items-end mb-4 pb-4 border-b border-slate-700/50 mt-4">
          <div>
            <p className="text-lg font-bold text-slate-100 mb-1">
              ₹{props.pay}
            </p>
            <p className="text-sm text-slate-400 flex items-center gap-1">
              📍 {props.location}
            </p>
          </div>
          <button 
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-teal-500 to-sky-500 hover:from-teal-400 hover:to-sky-400 text-white border-none rounded-lg px-4 py-2 text-sm font-semibold cursor-pointer transition-all shadow-lg shadow-sky-500/20 hover:shadow-sky-500/40 hover:-translate-y-0.5"
          >
            Apply Now
          </button>
        </div>

        {/* VIEW DETAILS LINK */}
        <div className="text-center">
          <Link 
            to={`/candidate/job/${props._id}`}
            className="text-sm text-teal-400 hover:text-teal-300 font-medium transition-colors hover:underline"
          >
            for more details &rarr;
          </Link>
        </div>
      </div>

      {/* Apply Form Modal */}
      {showForm && (
        <ApplyForm
          jobId={props._id}
          jobTitle={props.post}
          companyName={props.company}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  );
}

export default Card;