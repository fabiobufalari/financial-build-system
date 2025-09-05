import { useTranslation } from 'react-i18next';

const AccountsReceivablePage = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t('nav.accountsReceivable')}</h1>
      <p className="text-gray-600">
        {t('pages.accountsReceivable.description')}
      </p>
      {/* Accounts Receivable management content will be implemented here */}
    </div>
  );
};

export default AccountsReceivablePage;

