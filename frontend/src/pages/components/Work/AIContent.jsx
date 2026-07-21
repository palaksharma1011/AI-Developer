import React from "react";

import Markdown from "markdown-to-jsx";
import { render } from "react-dom";
import MarkdownCodeBlock from "./helpers/MarkdownCodeBlock";

const AIContent = ({ content }) => {
  const text = { content };
  return (
    <section className="text-amber-100 m-10 overflow-y-auto">
      <div>AI Content</div>
      <Markdown
        options={{
    overrides: {
      code: {
        component: MarkdownCodeBlock,
      },
    },
  }}
  >
    {content}
    </Markdown>
    </section>
  );
};

export default AIContent;
