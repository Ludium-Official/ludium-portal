import logoFooter from '@/assets/logo-footer.svg';
import customerService from '@/assets/social/customer-service.svg';
import discord from '@/assets/social/discord.svg';
import twitter from '@/assets/social/twitter.svg';
import youtube from '@/assets/social/youtube.svg';
import { Link } from 'react-router';

function Footer() {
  return (
    <footer className="border-t min-h-[310px] py-[64px] px-[60px] text-[#A4A4A4]">
      <div className="flex justify-between items-start">
        <div className="flex items-start gap-[252px]">
          <Link to="/">
            <img src={logoFooter} alt="logo" />
          </Link>
          <div>
            <h3 className="text-xs font-bold leading-[25px] mb-1">Contact us</h3>
            <a
              target="_blank"
              href="https://x.com/ludium_official"
              className="flex items-center gap-2 leading-[25px] mb-1 text-xs"
              rel="noreferrer"
            >
              <img src={twitter} alt="twitter" /> Twitter
            </a>
            <a
              target="_blank"
              href="https://www.youtube.com/@Ludium"
              className="flex items-center gap-2 leading-[25px] mb-1 text-xs"
              rel="noreferrer"
            >
              <img src={youtube} alt="youtube" /> Youtube
            </a>
            <a
              target="_blank"
              href="https://discord.gg/Ur6rJGjdAd"
              className="flex items-center gap-2 leading-[25px] mb-1 text-xs"
              rel="noreferrer"
            >
              <img src={discord} alt="discord" /> Discord
            </a>
            <a href="/" className="flex items-center gap-2 leading-[25px] mb-1 text-xs">
              <img src={customerService} alt="customer-service" /> Customer Service{' '}
            </a>
          </div>
        </div>
        <div className="text-sm">
          <p className="leading-[25px]">주식회사 루디움</p>
          <p className="leading-[25px]">대표자 : 임동선 l 사업자등록번호: 379-87-03224</p>
          <p className="leading-[25px]">서울시 서초구 강남대로 305 B117-14</p>
          <p className="leading-[25px]">이용약관 l 개인정보처리방침 l 운영 정책</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
