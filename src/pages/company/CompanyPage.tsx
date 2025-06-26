import { useTranslation } from 'react-i18next';

const CompanyPage = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t('nav.company')}</h1>
      <p className="text-gray-600">
        {t('pages.company.description')}
      </p>
      {/* Company management content will be implemented here */}
    </div>
  );
};

export default CompanyPage;

