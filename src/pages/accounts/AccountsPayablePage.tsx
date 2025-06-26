import { useTranslation } from 'react-i18next';

const AccountsPayablePage = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t('nav.accountsPayable')}</h1>
      <p className="text-gray-600">
        {t('pages.accountsPayable.description')}
      </p>
      {/* Accounts Payable management content will be implemented here */}
    </div>
  );
};

export default AccountsPayablePage;

