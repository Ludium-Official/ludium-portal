import logoFooter from '@/assets/logo-footer.svg';
import customerService from '@/assets/social/customer-service.svg';
import twitter from '@/assets/social/twitter.svg';
import { Link } from 'react-router';
import Discord from '@/assets/social/discord.svg?react';
import Youtube from '@/assets/social/youtube.svg?react';
import { useIsMobile } from '@/lib/hooks/use-mobile';
import { cn } from '@/lib/utils';

function Footer() {
  const isMobile = useIsMobile();

  return (
    <footer className="bg-white rounded-t-2xl min-h-[310px] py-16 px-4 md:px-[60px] text-neutral-400">
      <div className={cn('flex flex-col gap-4', isMobile && 'gap-9')}>
        <div
          className={cn(
            'flex flex-col md:flex-row items-start gap-8 md:gap-[252px] w-full md:w-auto',
            isMobile && 'gap-12',
          )}
        >
          <div
            className={cn(
              'flex justify-center md:justify-start w-full md:w-auto',
              isMobile && 'justify-start',
            )}
          >
            <Link to="/">
              <img src={logoFooter} alt="logo" />
            </Link>
          </div>
          <div className={cn("flex flex-row gap-40", isMobile && 'flex-col gap-8')}>
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
            <div>
              <h3 className="text-xs font-bold leading-[25px] mb-1">Company</h3>
              <a
                target="_blank"
                href="https://official.ludium.world"
                className="flex items-center gap-2 leading-[25px] mb-1 text-xs"
                rel="noreferrer"
              >
                Official
              </a>
            </div>
          </div>
        </div>
        <div className="text-xs">©2026 LUDIUM .ALL RIGHTS RESERVED.</div>
      </div>
    </footer>
  );
}

export default Footer;
