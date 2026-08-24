import type { PropsWithChildren } from "react";

const PageBackground = ({ children }: PropsWithChildren) => {
  return (
    <div className="page-background">
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />
      <div className="blob blob-4" />
      <div className="blob blob-5" />
      <div className="blob blob-6" />
      <div className="page-background__content">{children}</div>
    </div>
  );
};

export default PageBackground;
