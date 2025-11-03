export const Footer = () => {
  return (

    
    <footer className="w-full bg-gray-50 dark:bg-gray-950 py-0 text-center transition-colors">

        {/* 구분선 */}
      <div className="w-full max-w-7xl mx-auto border-t border-gray-200 dark:border-gray-700 mb-6" />
       

      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
        LOCH – AI-Powered Collaboration Platform
      </p>

      {/* 깃허브 링크 */}
      <a
        href="https://github.com/choyongmoo/LOCH-"
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-500 dark:text-blue-400 hover:underline block mt-1"
      >
        github
      </a>

      {/* 저작권 표시 */}
      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
        © 2024 - 2025 LOCH Team
      </p>
    </footer>
  );
};
