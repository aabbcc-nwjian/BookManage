import { useState } from "react";
import { useNavigate } from "react-router-dom";
import bgImage from "../../img/library.png";
import { login, register } from "../../api/login";

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"login" | "register">("login");

  const toLogin = async () => {
    const res = await login({ username, password });
    console.log(res);
    if (res.code === 200) {
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    }
  };
  const toRegister = async () => {
    const res = await register({ username, password });
    console.log(res);
  };

  const handleLogin = () => {
    if (status === "login") {
      toLogin();
    } else {
      toRegister();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: `url(${bgImage}) center / cover no-repeat`,
        position: "relative",
      }}
    >
      {/* 背景遮罩 */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(13, 45, 80, 0.65)",
        }}
      />

      {/* 登录卡片 */}
      <div
        style={{
          position: "relative",
          width: "400px",
          maxWidth: "90vw",
          padding: "44px 36px",
          borderRadius: "14px",
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          boxShadow: "0 12px 40px rgba(0, 0, 0, 0.3)",
          backdropFilter: "blur(10px)",
        }}
      >
        {/* 标题 */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{ fontSize: "40px", marginBottom: "8px" }}>📚</div>
          <h1
            style={{
              fontSize: "22px",
              fontWeight: 700,
              color: "#1a3a6b",
              margin: "0 0 6px",
            }}
          >
            图书管理系统
          </h1>
          <p style={{ color: "#999", fontSize: "13px", margin: 0 }}>
            欢迎回来，请登录您的账户
          </p>
        </div>

        {/* 用户名 */}
        <div style={{ marginBottom: "18px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              color: "#333",
              marginBottom: "6px",
              fontWeight: 500,
            }}
          >
            用户名
          </label>
          <input
            type="text"
            placeholder="请输入用户名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              padding: "11px 14px",
              fontSize: "14px",
              color: "#333",
              backgroundColor: "#f8f8f8",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#e94560";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(233,69,96,0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#e0e0e0";
              e.currentTarget.style.boxShadow = "";
            }}
          />
        </div>

        {/* 密码 */}
        <div style={{ marginBottom: "26px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              color: "#333",
              marginBottom: "6px",
              fontWeight: 500,
            }}
          >
            密码
          </label>
          <input
            type="password"
            placeholder="请输入密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            style={{
              width: "100%",
              padding: "11px 14px",
              fontSize: "14px",
              color: "#333",
              backgroundColor: "#f8f8f8",
              border: "1px solid #e0e0e0",
              borderRadius: "8px",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.2s, box-shadow 0.2s",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "#e94560";
              e.currentTarget.style.boxShadow = "0 0 0 3px rgba(233,69,96,0.1)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#e0e0e0";
              e.currentTarget.style.boxShadow = "";
            }}
          />
        </div>

        {/* 登录按钮 */}
        <button
          onClick={handleLogin}
          style={{
            width: "100%",
            padding: "12px 0",
            fontSize: "15px",
            fontWeight: 600,
            color: "#fff",
            backgroundColor: "#e94560",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            transition: "background-color 0.2s, transform 0.1s",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.backgroundColor = "#d63851")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.backgroundColor = "#e94560")
          }
          onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.98)")}
          onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          {status === "login" ? "登 录" : "注 册"}
        </button>

        {/* 底部提示 */}
        <p
          style={{
            textAlign: "center",
            color: "#bbb",
            fontSize: "12px",
            marginTop: "22px",
            marginBottom: 0,
          }}
          onClick={() => setStatus(status === "login" ? "register" : "login")}
        >
          {status === "login" ? "还没有账号？点击注册" : "已有账号？点击登录"}
        </p>
      </div>
    </div>
  );
}
