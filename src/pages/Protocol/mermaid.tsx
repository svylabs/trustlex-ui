import React, { useEffect } from "react";
import mermaid from "mermaid";

export interface MermaidProps {
  text: string;
}

export const Mermaid: React.FC<MermaidProps> = ({ text }) => {
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    mermaid.mermaidAPI.initialize({
      startOnLoad: true,
      securityLevel: "loose",
      theme: "base",
      logLevel: 1,
      themeVariables: {
        primaryColor: 'green',
        primaryTextColor: '#fff',
        lineColor: '#F8B229',
        secondaryColor: '#006100',
        tertiaryColor: '#fff'
      }
    });
  });

  useEffect(() => {
    if (ref.current && text !== "") {
        mermaid.render("preview", text).then((value) => {
            ref.current.innerHTML = value.svg;
        });
    }
  }, [text]);

  return <div key="preview" ref={ref} />;
};
