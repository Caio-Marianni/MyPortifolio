import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import LanguageSwitcher from '@/components/utils/LanguageSwitcher';
 
export default function HomePage() {
  const t = useTranslations('HomePage');
  return (
    <div>
      <h1>{t('title')}</h1>
      <Link href="/thumbnails">{t('about')}</Link>
      <LanguageSwitcher />
    </div>
  );
}