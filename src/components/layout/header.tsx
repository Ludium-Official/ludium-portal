import DevToolsDialog from "@/components/dev-tools-dialog";
import WalletWrapper from "@/pages/programs/details/_components/wallet-wrapper";

// 2. Initialization
// const wepinSdk = new WepinSDK({
//   appId: import.meta.env.VITE_WEPIN_APP_ID,
//   appKey: import.meta.env.VITE_WEPIN_APP_KEY,
// })

// const initWepin = wepinSdk.init({
//   defaultLanguage: 'en',
//   defaultCurrency: 'KRW',
// })

function Header() {
  return (
    <header className="flex justify-between items-center px-10 py-[14px] border-b">
      {import.meta.env.VITE_MODE === "local" && <DevToolsDialog />}
      <div />

      <div className="flex gap-2">
        <WalletWrapper
          className="rounded-md min-w-[83px] p-0 h-10 bg-[#B331FF] hover:bg-[#B331FF]/90 text-white text-[14px]"
          text="Log in"
        />
      </div>
    </header>
  );
}

export default Header;
