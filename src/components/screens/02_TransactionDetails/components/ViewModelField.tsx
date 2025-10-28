import type { ReactNode } from "react";

const ViewModelField = ({ children }: { children?: ReactNode }) => {
  return (
    <div className="py-2 px-0 border border-transparent">
      <p className=" h-[22px]">{children}</p>
    </div>
  );
};

export default ViewModelField;
