import logoFooter from '@/assets/logo-footer.svg';
import customerService from '@/assets/social/customer-service.svg';
import twitter from '@/assets/social/twitter.svg';
import { Link } from 'react-router';
import Discord from '@/assets/social/discord.svg?react';
import Youtube from '@/assets/social/youtube.svg?react';

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
              <Youtube className="w-4 h-4 fill-gray-text" /> Youtube
            </a>
            <a
              target="_blank"
              href="https://discord.gg/Ur6rJGjdAd"
              className="flex items-center gap-2 leading-[25px] mb-1 text-xs"
              rel="noreferrer"
            >
              <Discord className="w-4 h-4 fill-gray-text" /> Discord
            </a>
            <a href="/" className="flex items-center gap-2 leading-[25px] mb-1 text-xs">
              <img src={customerService} alt="customer-service" /> Customer Service{' '}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
