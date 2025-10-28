import { LogOut } from "lucide-react";
import NavLink from "./NavLink";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useContext } from "react";
import { UserContext } from "@/components/Context";
import { useTranslation } from "react-i18next";
import logoImage from "@/assets/img/logo.svg";

export interface UserType {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const Sidebar = () => {
  const { logout } = useContext(UserContext);
  const { t } = useTranslation();
  return (
    <div className="h-full w-[250px] bg-zinc-200/50 border-r border-input flex flex-row flex-none">
      <div className="w-full flex flex-col overflow-hidden">
        <Link
          to="/"
          className="px-4 h-[59px] w-full bg-[#F36E22] flex-none flex items-center justify-start gap-1 relative"
        >
          <img src={logoImage} />
        </Link>
        <NavLink to="/" className="bg-[#F36E22]">
          {t("Dashboard")}
        </NavLink>
        <NavLink to="/categories" className="bg-[#F36E22]">
          {t("Categories")}
        </NavLink>

        <div className="flex-1 flex flex-col justify-end px-2 pb-4">
          <Button
            variant="ghost"
            className="w-full flex justify-between px-4 py-2 h-auto gap-2 text-red-700 hover:text-red-700"
            onClick={logout}
          >
            <span className="flex flex-row items-center justify-start gap-1">
              <LogOut size={16} />
              {t("Sign out")}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
