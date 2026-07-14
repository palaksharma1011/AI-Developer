import { X } from "lucide-react";
import Projects from "./Projects";

const ProjectModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center
                 bg-black/70 backdrop-blur-md animate-fadeIn"
    >
      {/* Modal */}
      <div
        className="relative w-[90%] max-w-lg rounded-2xl
                   border border-cyan-400/30
                   bg-[#0A0A0A]
                   shadow-[0_0_30px_rgba(34,211,238,0.15)]
                   p-8 animate-scaleIn"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-2
                     text-gray-400 transition-all
                     hover:bg-cyan-500/10
                     hover:text-cyan-400"
        >
          <X size={22} />
        </button>

        {/* Heading */}
        <h2 className="text-3xl font-bold tracking-wide text-white">
          Which{" "}
          <span className="text-cyan-400">
            project
          </span>{" "}
          to work on?
        </h2>


        {/* Divider */}
        <div className="mt-3 h-[2px] w-24 rounded-full bg-cyan-400"></div>

        {/* Content */}
        <Projects/>
      </div>
    </div>
  );
};

export default ProjectModal;