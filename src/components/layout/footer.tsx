import logoFooter from "@/assets/logo-footer.svg";
import customerService from "@/assets/social/customer-service.svg";
import { Link } from "react-router";

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
            <h3 className="text-xs font-bold leading-[25px] mb-1">
              Contact us
            </h3>

            <a
              href="/"
              className="flex items-center gap-2 leading-[25px] mb-1 text-xs"
            >
              <img src={customerService} alt="customer-service" /> Customer
              Service{" "}
            </a>
          </div>
        </div>
        <div className="text-xs md:text-sm text-center md:text-left mt-4 md:mt-0">
          <p className="leading-[25px] font-bold">Company Info (법인 정보)</p>
          <p className="leading-[25px]">법인명: 바스 주식회사</p>
          <p className="leading-[25px]">사업자등록번호: 365-88-03386</p>
          <p className="leading-[25px]">대표자: 박상희</p>
          <p className="leading-[25px]">
            사업장 소재지: 경기도 성남시 수정구 탄리로147번길 23, 1층(태평동)
          </p>
          <p className="leading-[25px]">
            업태/종목: 정보통신업 / 응용 소프트웨어 개발 및 공급업
          </p>
          <p className="mt-4 leading-[25px]">
            본 사이트의 내용은 정보 제공 목적이며, 특정 결과를 보장하지
            않습니다.
            <br />
            프로그램 세부 내용은 운영 상황에 따라 변경될 수 있습니다.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
