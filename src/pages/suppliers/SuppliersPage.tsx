import { useTranslation } from 'react-i18next';

const SuppliersPage = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t('nav.suppliers')}</h1>
      <p className="text-gray-600">
        {t('pages.suppliers.description')}
      </p>
      {/* Suppliers management content will be implemented here */}
    </div>
  );
};

export default SuppliersPage;

