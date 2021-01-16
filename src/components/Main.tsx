import "antd/dist/antd.css";
import "./Main.css";
import { Divider } from "antd";

const Main = (): JSX.Element => {
  return (
    <div className="signUp">
      <h2>매치목록</h2>
      <Divider className="divider" />
      <section className="signUpContainer"></section>
    </div>
  );
};

export default Main;
