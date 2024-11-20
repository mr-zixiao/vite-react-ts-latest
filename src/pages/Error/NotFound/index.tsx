import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div style={{ textAlign: "center" }}>
      <p>404</p>
      <p>页面不存在</p>
      <p>
        <Link to={"/"}>返回首页</Link>
      </p>
    </div>
  );
}
export default NotFound;
