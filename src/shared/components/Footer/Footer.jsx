import React from 'react';

const FooterContent = () => {
  return (
    <div className="max-w-6xl mx-auto flex flex-wrap justify-around gap-5 text-left">
      {/* Existing content */}
      <div className="flex-1 min-w-[200px]">
        <h3 className="text-gray-800 text-lg font-semibold mb-3">StudyIn</h3>
        <p className="mb-2 leading-relaxed">스터디를 위한 최고의 플랫폼</p>
        <p className="mb-2 leading-relaxed">&copy; 2023 StudyIn. All rights reserved.</p>
      </div>

      <div className="flex-1 min-w-[200px]">
        <h4 className="text-gray-800 text-base font-semibold mb-3">Quick Links</h4>
        <ul>
          <li className="mb-2"><a href="/about" className="text-gray-700 hover:underline">About Us</a></li>
          <li className="mb-2"><a href="/contact" className="text-gray-700 hover:underline">Contact</a></li>
          <li className="mb-2"><a href="/privacy" className="text-gray-700 hover:underline">Privacy Policy</a></li>
          <li className="mb-2"><a href="/terms" className="text-gray-700 hover:underline">Terms of Service</a></li>
        </ul>
      </div>

      <div className="flex-1 min-w-[200px]">
        <h4 className="text-gray-800 text-base font-semibold mb-3">Follow Us</h4>
        <div className="flex gap-4 mt-2">
          {/* Placeholder for social media icons */}
          <a href="#"><img src="/path/to/facebook-icon.svg" alt="Facebook" className="w-6 h-6" /></a>
          <a href="#"><img src="/path/to/twitter-icon.svg" alt="Twitter" className="w-6 h-6" /></a>
          <a href="#"><img src="/path/to/instagram-icon.svg" alt="Instagram" className="w-6 h-6" /></a>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-50 p-10 border-t border-gray-200 text-gray-700 text-sm">
      <FooterContent />
    </footer>
  );
};

export default Footer;
