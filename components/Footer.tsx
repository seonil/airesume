
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-800 mt-auto p-4 text-center text-xs text-gray-500 dark:text-gray-400">
      <div className="container mx-auto">
        <p>본 서비스는 AI를 사용하여 이미지를 생성합니다. 본인 사진만 사용해야 하며, 타인의 사진을 무단으로 사용해서는 안 됩니다.</p>
        <p>결과물은 실제와 다를 수 있으며, 오용으로 인한 책임은 사용자에게 있습니다. 생성된 이미지는 저장되지 않습니다.</p>
        <p className="mt-2">&copy; 2025 AI Resume Photo Pro. All Rights Reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
