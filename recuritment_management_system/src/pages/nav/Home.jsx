import React from "react";
import { Link } from "react-router-dom";
import { Users, UserCircle, Briefcase, FileSignature, ArrowRight, ShieldCheck, Zap } from "lucide-react";

const Home = () => {
  return (
    <div className="w-full relative overflow-hidden bg-slate-900 min-h-screen text-slate-200">
      
      {/* Background Animated Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob"></div>
        <div className="absolute top-[20%] right-[-10%] w-[30rem] h-[30rem] bg-cyan-500 rounded-full mix-blend-screen filter blur-[120px] opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-[25rem] h-[25rem] bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] opacity-40 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="py-32 px-6 flex flex-col items-center justify-center text-center max-w-5xl mx-auto min-h-[70vh]">
         
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight outfit-font text-white">
            Future of <span className="text-gradient">Recruitment</span> <br className="hidden md:block"/> Management
          </h1>
          <p className="text-lg md:text-xl mb-10 max-w-2xl text-slate-400 font-medium tracking-wide">
            A unified, intelligent ecosystem to manage hiring, schedule interviews, and track candidates seamlessly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/register/hr" className="bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-8 py-3 rounded-xl font-bold hover:shadow-[0_0_20px_rgba(99,102,241,0.5)] transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
              Start Hiring <ArrowRight size={18} />
            </Link>
            <Link to="/login/candidate" className="glass px-8 py-3 rounded-xl font-bold text-white hover:bg-slate-800 transition-all hover:-translate-y-1 flex items-center justify-center">
              Candidate Login
            </Link>
          </div>
        </section>

        {/* Roles Section */}
        <section className="py-24 px-6 border-t border-white/5 bg-slate-900/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold outfit-font mb-4 text-white">Choose Your Profile</h2>
              <p className="text-slate-400 max-w-2xl mx-auto text-lg">Secure and customized access for every role in your recruitment pipeline.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { title: "Admin", desc: "Manage system roles & secure access", icon: <ShieldCheck size={40} className="text-indigo-400" />, login: "/login/admin", color: "hover:border-indigo-500" },
                { title: "HR Manager", desc: "Post jobs, list matching candidates", icon: <Briefcase size={40} className="text-cyan-400" />, login: "/login/hr", color: "hover:border-cyan-500" },
                { title: "Interviewer", desc: "Evaluate & conduct technical rounds", icon: <Users size={40} className="text-purple-400" />, login: "/login/interviewer", color: "hover:border-purple-500" },
                { title: "Candidate", desc: "Apply, track & ace your interviews", icon: <UserCircle size={40} className="text-pink-400" />, login: "/login/candidate", color: "hover:border-pink-500" },
              ].map((role, i) => (
                <Link
                  to={role.login}
                  key={i}
                  className={`block glass-card rounded-2xl p-8 transition-all duration-300 group cursor-pointer hover:-translate-y-2 border border-slate-700/50 ${role.color}`}
                >
                  <div className="mb-6 p-4 bg-slate-800/50 inline-block rounded-2xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                    {role.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 outfit-font">
                    {role.title}
                  </h3>
                  <p className="text-slate-400 font-medium leading-relaxed">
                    {role.desc}
                  </p>
                  <div className="mt-8 flex items-center gap-2 text-sm font-bold text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity">
                    Access Portal <ArrowRight size={16} />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        {/* <section className="py-24 px-6 border-t border-white/5 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/20 to-transparent pointer-events-none"></div>
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-800">
              {[
                { num: "120+", label: "Active Jobs" },
                { num: "5k+", label: "Candidates" },
                { num: "80+", label: "Companies" },
                { num: "95%", label: "Success Rate" },
              ].map((item, i) => (
                <div key={i} className="px-4">
                  <h2 className="text-4xl md:text-6xl font-extrabold text-gradient mb-2 outfit-font">{item.num}</h2>
                  <p className="text-slate-400 font-medium tracking-wider uppercase text-sm md:text-base">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section> */}

        {/* Call To Action */}
        

      </div>
    </div>
  );
};

export default Home;
