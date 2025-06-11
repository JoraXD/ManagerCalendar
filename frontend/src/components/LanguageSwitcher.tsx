import { useLanguage, type Language } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  const languages = [
    {
      code: 'en' as Language,
      name: 'English',
      flag: '🇺🇸'
    },
    {
      code: 'ru' as Language,
      name: 'Русский',
      flag: '🇷🇺'
    }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  return (
    <div className="relative inline-block text-left">
      <div className="flex space-x-1">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`
              flex items-center space-x-2 px-3 py-2 rounded-lg transition-all duration-200
              ${language === lang.code 
                ? 'bg-blue-100 text-blue-700 border-2 border-blue-300' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border-2 border-transparent hover:border-gray-300'
              }
            `}
            title={lang.name}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="text-sm font-medium hidden sm:block">{lang.code.toUpperCase()}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;