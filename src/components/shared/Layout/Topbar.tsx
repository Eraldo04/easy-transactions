import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslation } from "react-i18next";

const Topbar = () => {
  const { t, i18n } = useTranslation();

  function changeLanguage(language: string) {
    i18n.changeLanguage(language);
    if (typeof window !== "undefined") {
      localStorage.setItem("lng", language);
    }
  }

  return (
    <div className="top-0 bg-white sticky w-full flex-1 h-12 z-10 flex justify-between items-center pr-4">
      <h3 className="w-screen ml-4 font-medium text-[#F36E22]-700 text-sm line-clamp-1">
        {t("Electronic transaction implementation platform")}
      </h3>
      <Select value={i18n.language} onValueChange={changeLanguage}>
        <SelectTrigger className="w-fit">
          <SelectValue className="text-red-500" />
        </SelectTrigger>
        <SelectContent side="bottom" align="end">
          <SelectItem value="al">{t("🇦🇱 Shqip")}</SelectItem>
          <SelectItem value="en">{t("🇺🇸 English")}</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default Topbar;
