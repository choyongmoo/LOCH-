const Footer = () => {
  return (
    <footer className="w-full bg-gray-100 py-6 border-t mt-20">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-500">
        {/* 왼쪽: 로고 및 저작권 */}
        <div className="mb-4 md:mb-0">
          <strong>Loch</strong> © 2025. All rights reserved.
          <br/>
          <strong>오택현</strong> 010-9367-7971
        </div>

        {/* 오른쪽: 링크 */}
        <div className="flex space-x-4">
          <a href="#" className="hover:text-black">이용약관</a>
          <a href="#" className="hover:text-black">개인정보처리방침</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-black">
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
