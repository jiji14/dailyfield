import "antd/dist/antd.css";
import { useParams } from "react-router-dom";
import AddMatch from "./AddMatch";

const Admin = (): JSX.Element => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className="admin">
      <AddMatch id={id} />
    </div>
  );
};

export default Admin;
