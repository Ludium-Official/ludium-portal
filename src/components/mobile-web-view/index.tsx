import ludiumMobileView from '@/assets/icons/mobile/ludium-mobile-view.svg';
import logo from '@/assets/logo.svg';
import notify from '@/lib/notify';
import { Link } from 'react-router';
import { Button } from '../ui/button';

function MobileWebView() {
  return (
    <main className="mx-[16px]">
      <header className="my-[14px]">
        <img className="w-[53px]" src={logo} alt="LUDIUM" />
      </header>
      <body className="flex flex-col items-center">
        <div className="w-full bg-gradient-to-t from-primary via-primary to-primary bg-opacity-100 rounded-lg">
          <div className="relative flex flex-col items-center bg-gradient-to-b from-[rgba(255,255,255,0.12)] to-[rgba(0,0,0,0.2)] p-[12px] rounded-lg">
            <img className="absolute top-[-50px]" src={ludiumMobileView} alt="LUDIUM Mobile View" />
            <div className="w-full mt-[353px] p-[12px] bg-gray-dark rounded-lg text-white text-center text-[14px]">
              <div>
                For the best Web3 builder experience,
                <br />
                please use Ludium on a PC web browser.
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[8px] w-full mt-[8px]">
          <Button
            className="bg-transparent w-full text-gray-dark leading-[20px] rounded-lg shadow-none"
            onClick={() => notify('Please use PC web browser.', 'blank')}
          >
            DESKTOP ACCESS ONLY
          </Button>
          <Link to="https://ludium.oopy.io/" target="_blank">
            <Button className="w-full text-gray-light leading-[20px] rounded-lg">
              ABOUT LUDIUM
            </Button>
          </Link>
        </div>
      </body>
    </main>
  );
}

export default MobileWebView;
