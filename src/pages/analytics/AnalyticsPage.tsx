import { useTranslation } from 'react-i18next';

const AnalyticsPage = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t('nav.analytics')}</h1>
      <p className="text-gray-600">
        {t('pages.analytics.description')}
      </p>
    </div>
  );
};

export default AnalyticsPage;
