import React from "react";
import axios from "../../config/axios";

const CreateProject = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    console.log(name);
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(
        "/projects/create",
        { name },
        {
          withCredentials: true,
        },
      );
      console.log(response);
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return (
    <main className="min-h-screen bg-black text-white px-6 py-8">
      <section className="create-project flex justify-center">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-950 p-6 shadow-lg"
        >
          <label className="mb-2 block text-sm font-semibold uppercase tracking-wider text-cyan-400">
            name of project
          </label>

          <input
            name="name"
            className="mb-6 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-3 text-white outline-none transition-all duration-200 placeholder:text-zinc-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30"
            type="textarea"
          ></input>

          <button className="rounded-lg bg-cyan-500 px-5 py-3 font-medium text-black transition-all duration-200 hover:bg-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] active:scale-95">
            Create
          </button>
        </form>
      </section>
    </main>
  );
};

export default CreateProject;
