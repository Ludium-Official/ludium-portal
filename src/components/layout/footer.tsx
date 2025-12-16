import logoFooter from '@/assets/logo-footer.svg';
import customerService from '@/assets/social/customer-service.svg';
import { Link } from 'react-router';

function Footer() {
  return (
    <footer className="bg-white rounded-t-2xl min-h-[310px] md:min-h-[310px] py-8 md:py-[64px] px-4 md:px-[60px] text-gray-text">
      <div className="flex flex-col md:flex-row justify-between items-start gap-8 md:gap-0">
        <div className="flex flex-col md:flex-row items-start gap-8 md:gap-[252px] w-full md:w-auto">
          <div className="flex justify-center md:justify-start w-full md:w-auto">
            <Link to="/">
              <img src={logoFooter} alt="logo" className="h-8 md:h-auto" />
            </Link>
          </div>
          <div className="text-center md:text-left">
            <h3 className="text-xs font-bold leading-[25px] mb-1">Contact us</h3>

            <a href="/" className="flex items-center gap-2 leading-[25px] mb-1 text-xs">
              <img src={customerService} alt="customer-service" /> Customer Service{' '}
            </a>
          </div>
        </div>
        <div className="text-xs md:text-sm text-center md:text-left mt-4 md:mt-0">
          <p className="leading-[25px]">
            © 2025 Blockchain Alliance Syndicate(BAS) Project. All rights reserved.
          </p>
          <p className="leading-[25px]">Powered by BAS</p>
          <p className="leading-[25px]">
            본 사이트는 준비 중인 서비스로, 정식 사업자 등록 전까지 사업자정보는 기재되지 않습니다.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
