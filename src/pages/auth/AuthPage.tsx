import { useTranslation } from 'react-i18next';

const AuthPage = () => {
  const { t } = useTranslation();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{t('nav.authentication')}</h1>
      <p className="text-gray-600">
        {t('pages.auth.description')}
      </p>
      {/* Authentication management content will be implemented here */}
    </div>
  );
};

export default AuthPage;

