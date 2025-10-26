import { cn } from "@/lib/utils";
import { LayoutDashboardIcon, UsersIcon } from "lucide-react";
import React, { useMemo } from "react";
import {
  NavLink as RRDNavlink,
  useLocation,
  type NavLinkProps,
} from "react-router-dom";

const NavLinkComponent: React.FC<NavLinkProps> = ({ children, to }) => {
  const icon = useMemo(() => {
    if (to === "/")
      return (
        <LayoutDashboardIcon className="flex-none -ml-[0.5px]" size={16} />
      );
    if (to.toString().startsWith("/users-example"))
      return <UsersIcon className="flex-none -ml-[0.5px]" size={16} />;
  }, [to]);

  const location = useLocation();

  function extractRootPath(path: string) {
    const endIndex = path.indexOf("/", 1);
    if (endIndex !== -1) {
      return path.substring(0, endIndex);
    } else {
      return path;
    }
  }

  const isActive = useMemo(() => {
    if (
      extractRootPath(to.toString()) === "/" &&
      extractRootPath(location.pathname) === "/"
    ) {
      return true;
    } else if (
      extractRootPath(to.toString()) !== "/" &&
      extractRootPath(location.pathname) !== "/"
    ) {
      return extractRootPath(to.toString())?.includes(
        extractRootPath(location.pathname)
      );
    }
  }, [location.pathname, to]);

  return (
    <RRDNavlink to={to}>
      {typeof children !== "function" ? (
        <div className="group py-1 px-2">
          <div
            className={cn(
              "relative flex flex-row h-9 justify-start items-center px-2.5 rounded-xl border transition-colors duration-150",
              isActive
                ? "bg-[#F36E22] border-[#F36E22] overflow-hidden"
                : "border-transparent"
            )}
          >
            {icon}
            {typeof children === "string" || typeof children === "number" ? (
              <p className="font-medium text-sm overflow-hidden absolute left-8 whitespace-nowrap">
                {children}
              </p>
            ) : null}
          </div>
        </div>
      ) : (
        children
      )}
    </RRDNavlink>
  );
};

export default NavLinkComponent;
