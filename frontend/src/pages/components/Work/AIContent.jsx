import React from "react";

const AIContent = ({ content }) => {
  return (
    <section className="text-amber-100 m-10">
      <div>AI Content</div>
      <div className="bg-cyan-300 text-cyan-900 rounded-3xl p-5  text-center">{content}</div>
    </section>
  );
};

export default AIContent;
