import React, { useState } from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
    const [open, setOpen] = useState(false);
    const [loginOpen, setLoginOpen] = useState(false);
    const [registerOpen, setRegisterOpen] = useState(false);

    return (
        <nav className="bg-cyan-700 text-white relative">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

                <h1 className="text-2xl font-bold tracking-wide">Somnath</h1>

                <ul className="hidden md:flex items-center gap-8 text-lg">
                    <Link className="hover:text-cyan-200" to="/">Home</Link>
                    <Link className="hover:text-cyan-200" to="/about">About</Link>
                    <Link className="hover:text-cyan-200" to="/contact">Contact</Link>
                    <Link className="hover:text-cyan-200" to="/services">Services</Link>

                    <div
                        className="relative"
                        onMouseEnter={() => {
                            setLoginOpen(true);
                            setRegisterOpen(false);
                        }}
                        onMouseLeave={() => setLoginOpen(false)}
                    >
                        <button className="hover:text-cyan-200">
                            Login ▾
                        </button>

                        {loginOpen && (
                            <div className="absolute top-8 right-0 bg-white text-black rounded shadow w-48">
                                <Link className="block px-4 py-2 hover:bg-gray-100" to="/login/hr">HR</Link>
                                <Link className="block px-4 py-2 hover:bg-gray-100" to="/login/interviewer">Interviewer</Link>
                                <Link className="block px-4 py-2 hover:bg-gray-100" to="/login/candidate">Candidate</Link>
                            </div>
                        )}
                    </div>


                    <div
                        className="relative"
                        onMouseEnter={() => {
                            setRegisterOpen(true);
                            setLoginOpen(false);
                        }}
                        onMouseLeave={() => setRegisterOpen(false)}
                    >
                        <button className="hover:text-cyan-200">
                            Register ▾
                        </button>

                        {registerOpen && (
                            <div className="absolute top-8 right-0 bg-white text-black rounded shadow w-48">
                                <Link className="block px-4 py-2 hover:bg-gray-100" to="/register/hr">HR</Link>
                                <Link className="block px-4 py-2 hover:bg-gray-100" to="/register/interviewer">Interviewer</Link>
                                <Link className="block px-4 py-2 hover:bg-gray-100" to="/register/candidate">Candidate</Link>
                            </div>
                        )}
                    </div>

                </ul>

                <button
                    className="md:hidden text-2xl"
                    onClick={() => setOpen(!open)}
                >
                    ☰
                </button>
            </div>

            {open && (
                <div className="md:hidden bg-cyan-600 px-4 py-4 space-y-3">
                    <Link className="block hover:text-cyan-200" to="/">Home</Link>
                    <Link className="block hover:text-cyan-200" to="/about">About</Link>
                    <Link className="block hover:text-cyan-200" to="/contact">Contact</Link>
                    <Link className="block hover:text-cyan-200" to="/services">Services</Link>

                    <div>
                        <p className="font-semibold mt-3">Login</p>
                        <Link className="block pl-4 py-1" to="/login/hr">HR</Link>
                        <Link className="block pl-4 py-1" to="/login/interviewer">Interviewer</Link>
                        <Link className="block pl-4 py-1" to="/login/candidate">Candidate</Link>
                    </div>

                    {/* Mobile Register */}
                    <div>
                        <p className="font-semibold mt-3">Register</p>
                        <Link className="block pl-4 py-1" to="/register/hr">HR</Link>
                        <Link className="block pl-4 py-1" to="/register/interviewer">Interviewer</Link>
                        <Link className="block pl-4 py-1" to="/register/candidate">Candidate</Link>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
