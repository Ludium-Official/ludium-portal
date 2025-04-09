import logoFooter from '@/assets/logo-footer.svg'
import customerService from '@/assets/social/customer-service.svg'
import discord from '@/assets/social/discord.svg'
import twitter from '@/assets/social/twitter.svg'
import youtube from '@/assets/social/youtube.svg'
import { Link } from 'react-router'

function Footer() {

  return (
    <footer className='border-t min-h-[310px] py-[64px] px-[60px] text-[#A4A4A4]'>
      <div className='flex justify-between items-start'>
        <div className='flex items-start gap-[252px]'>
          <Link to="/">
            <img src={logoFooter} alt="logo" />
          </Link>
          <div>
            <h3 className='text-xs font-bold leading-[25px] mb-1'>Contact us</h3>
            <a href="https://twitter.com" className='flex items-center gap-2 leading-[25px] mb-1 text-xs'><img src={twitter} alt="twitter" /> Twitter</a>
            <a href="https://youtube.com" className='flex items-center gap-2 leading-[25px] mb-1 text-xs'><img src={youtube} alt="youtube" /> Youtube</a>
            <a href="https://discord.com" className='flex items-center gap-2 leading-[25px] mb-1 text-xs'><img src={discord} alt="discord" /> Discord</a>
            <a href="/customer-service" className='flex items-center gap-2 leading-[25px] mb-1 text-xs'><img src={customerService} alt="customer-service" /> Customer Service  </a>
          </div>
        </div>
        <div className='text-sm'>
          <p className='leading-[25px]'>개인정보처리방침 l 이용약관</p>
          <p className='leading-[25px]'>(주)루디움 l 대표자 : 임동선</p>
          <p className='leading-[25px]'>개인정보보호책임자 : 임동선</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
