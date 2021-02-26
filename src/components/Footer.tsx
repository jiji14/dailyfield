import "antd/dist/antd.css";
import "./Footer.css";

const Footer = (): JSX.Element => {
  return (
    <div className="footerContainer">
      <a href="/privacypolicy" target="_blank" className="footerLink">
        개인 정보 처리방침
      </a>
      <a href="/termsofservice" target="_blank" className="footerLink">
        서비스 이용약관
      </a>
    </div>
  );
};

export default Footer;
