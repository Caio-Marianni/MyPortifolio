import { IoIosInformationCircle } from "react-icons/io";
import { useLanguage } from "./utils/LanguageProvider";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <div className="container flex flex-col justify-center items-center gap-4 my-16 px-4">
      <div className="flex items-center gap-2 rounded-full px-4 py-2 bg-white/5 text-white/40 hover:text-white/70 hover:bg-white/10 transition-colors duration-200 backdrop-blur-sm cursor-help">
        <IoIosInformationCircle size={18} className="opacity-50" />
        <p className="text-sm">{t("footerInfoH1")}</p>
      </div>
      <div className="flex items-center px-4 py-2 rounded-full bg-white/5 text-white/40 text-sm backdrop-blur-sm shadow-sm hover:text-white/70 transition-colors duration-200">
        ⚠️ {t("footerWarningH1")}
      </div>
    </div>
  );
}
