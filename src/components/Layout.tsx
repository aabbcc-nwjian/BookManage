import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function Layout() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const isAdmin = role === "admin"; // TODO: 替换为实际的权限判断逻辑

  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
    >
      {/* 顶部导航栏 */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
          padding: "0 24px",
          height: "56px",
          backgroundColor: "#1a3a6b",
          color: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
        }}
      >
        {/* Logo / 品牌 */}
        <span
          style={{
            fontSize: "18px",
            fontWeight: 700,
            cursor: "pointer",
            marginRight: "16px",
          }}
          onClick={() => navigate("/home")}
        >
          📚 图书管理系统
        </span>

        {/* 导航链接 */}
        <NavLink
          to="/home"
          style={({ isActive }) => ({
            color: isActive ? "#e94560" : "#ccc",
            textDecoration: "none",
            fontSize: "15px",
            fontWeight: isActive ? 600 : 400,
            padding: "6px 12px",
            borderRadius: "6px",
            transition: "all 0.2s",
          })}
        >
          首页
        </NavLink>

        <NavLink
          to="/books"
          style={({ isActive }) => ({
            color: isActive ? "#e94560" : "#ccc",
            textDecoration: "none",
            fontSize: "15px",
            fontWeight: isActive ? 600 : 400,
            padding: "6px 12px",
            borderRadius: "6px",
            transition: "all 0.2s",
          })}
        >
          图书列表
        </NavLink>

        <NavLink
          to="/borrows"
          style={({ isActive }) => ({
            color: isActive ? "#e94560" : "#ccc",
            textDecoration: "none",
            fontSize: "15px",
            fontWeight: isActive ? 600 : 400,
            padding: "6px 12px",
            borderRadius: "6px",
            transition: "all 0.2s",
          })}
        >
          借阅记录
        </NavLink>

        <NavLink
          to="/reserves"
          style={({ isActive }) => ({
            color: isActive ? "#e94560" : "#ccc",
            textDecoration: "none",
            fontSize: "15px",
            fontWeight: isActive ? 600 : 400,
            padding: "6px 12px",
            borderRadius: "6px",
            transition: "all 0.2s",
          })}
        >
          预约记录
        </NavLink>

        <NavLink
          to="/fines"
          style={({ isActive }) => ({
            color: isActive ? "#e94560" : "#ccc",
            textDecoration: "none",
            fontSize: "15px",
            fontWeight: isActive ? 600 : 400,
            padding: "6px 12px",
            borderRadius: "6px",
            transition: "all 0.2s",
          })}
        >
          罚款记录
        </NavLink>

        <NavLink
          to="/my"
          style={({ isActive }) => ({
            color: isActive ? "#e94560" : "#ccc",
            textDecoration: "none",
            fontSize: "15px",
            fontWeight: isActive ? 600 : 400,
            padding: "6px 12px",
            borderRadius: "6px",
            transition: "all 0.2s",
          })}
        >
          我的
        </NavLink>

        {/* 管理员入口（仅管理员可见） */}
        {isAdmin && (
          <NavLink
            to="/admin"
            style={({ isActive }) => ({
              color: isActive ? "#e94560" : "#f1c40f",
              textDecoration: "none",
              fontSize: "15px",
              fontWeight: isActive ? 600 : 400,
              padding: "6px 12px",
              borderRadius: "6px",
              transition: "all 0.2s",
            })}
          >
            ⚙️ 管理员页面
          </NavLink>
        )}

        <div style={{ flex: 1 }} />

        {/* 右侧操作区 */}
        <NavLink
          to={username ? "/my" : "/login"}
          style={({ isActive }) => ({
            color: isActive ? "#e94560" : "#ccc",
            textDecoration: "none",
            fontSize: "14px",
            padding: "6px 12px",
            borderRadius: "6px",
            transition: "all 0.2s",
          })}
        >
          {username || "登录"}
        </NavLink>
      </nav>

      {/* 页面内容区 */}
      <main style={{ flex: 1, padding: "56px 24px 24px 24px" }}>
        <Outlet />
      </main>

      {/* 底部 */}
      <footer
        style={{
          textAlign: "center",
          padding: "16px",
          color: "#5a7fa0",
          fontSize: "13px",
          backgroundColor: "#d6eaf8",
          borderTop: "1px solid #b8d4f0",
        }}
      >
        图书管理系统 © 2026
      </footer>
    </div>
  );
}
