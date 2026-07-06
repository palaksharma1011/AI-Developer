import React from "react";
import { UserContext } from "../../context/User.context";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <header className="mb-8 border-b border-zinc-800 pb-4">
        <h1 className="text-3xl font-bold tracking-wide text-cyan-400">
          HOME PAGE
        </h1>
      </header>

      <section className="user mb-8">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 shadow-lg">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-400">
            User Details
          </h2>
          <pre className="overflow-x-auto rounded-md bg-zinc-900 p-4 text-sm text-zinc-200">
            {JSON.stringify({ user }, null, 2)}
          </pre>
        </div>
      </section>

      <section className="project">
        <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-5 shadow-lg">
          <button
            onClick={() => navigate("/project/create")}
            className="rounded-lg bg-cyan-500 px-5 py-3 font-medium text-black transition-all duration-200 hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] active:scale-95"
          >
            <span>Create project</span>
          </button>
        </div>
      </section>
    </main>
  );
};

export default Home;
