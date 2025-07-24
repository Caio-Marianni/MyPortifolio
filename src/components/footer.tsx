import { IoIosInformationCircle } from "react-icons/io";
import { useLanguage } from "./utils/LanguageProvider";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <div className="container flex flex-col justify-center items-center py-2 px-4 my-20">
      {/* Info */}
      <div className="text-white/60 hover:text-white/100 transition-opacity flex items-center gap-1 border border-slate-600 py-2 px-4 rounded-full text-white bg-slate-700/50">
        <IoIosInformationCircle size={24} />
        <p>{t("footerInfoH1")}</p>
      </div>
    </div>
  );
}
