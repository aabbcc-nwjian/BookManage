import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { changePassword } from "../../api/login";
import { reportReaderLost, activateReader, getReaderDetail } from "../../api";

export default function MyPage() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "未登录";
  const role = localStorage.getItem("role") || "reader";

  // 修改密码表单
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMsg, setPasswordMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 挂失状态
  const readerId = Number(localStorage.getItem("reader_id")) || 0;
  const [isLost, setIsLost] = useState(false);
  const [lostLoading, setLostLoading] = useState(true);
  const [lostSubmitting, setLostSubmitting] = useState(false);
  const [lostMsg, setLostMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // 页面加载时查询读者当前状态
  useEffect(() => {
    if (!readerId) {
      setLostLoading(false);
      return;
    }
    getReaderDetail(readerId)
      .then((res) => {
        if (res.code === 200) {
          setIsLost(res.data.status === "lost");
        }
      })
      .finally(() => setLostLoading(false));
  }, [readerId]);

  // 切换挂失状态：已挂失→取消挂失，未挂失→申请挂失
  const handleToggleLost = async () => {
    if (isLost) {
      // 取消挂失
      setLostSubmitting(true);
      setLostMsg(null);
      try {
        const res = await activateReader(readerId);
        if (res.code === 200) {
          setIsLost(false);
          setLostMsg({ type: "success", text: "已取消挂失，读者证恢复正常使用。" });
        } else {
          setLostMsg({
            type: "error",
            text: res.message || res.msg || "取消挂失失败，请重试",
          });
        }
      } catch {
        setLostMsg({ type: "error", text: "网络错误，请稍后重试" });
      } finally {
        setLostSubmitting(false);
      }
    } else {
      // 申请挂失
      setLostSubmitting(true);
      setLostMsg(null);
      try {
        const res = await reportReaderLost(readerId);
        if (res.code === 200) {
          setIsLost(true);
          setLostMsg({ type: "success", text: "挂失成功！您的读者证已暂停使用。" });
        } else {
          setLostMsg({
            type: "error",
            text: res.message || res.msg || "挂失失败，请重试",
          });
        }
      } catch {
        setLostMsg({ type: "error", text: "网络错误，请稍后重试" });
      } finally {
        setLostSubmitting(false);
      }
    }
  };

  // 动画 refs
  const profileCardRef = useRef<HTMLDivElement>(null);
  const passwordCardRef = useRef<HTMLDivElement>(null);
  const borrowCardRef = useRef<HTMLAnchorElement>(null);
  const reserveCardRef = useRef<HTMLAnchorElement>(null);
  const fineCardRef = useRef<HTMLAnchorElement>(null);

  // 角色中文映射
  const roleLabel: Record<string, string> = {
    admin: "管理员",
    librarian: "图书管理员",
    reader: "读者",
  };

  // 入场动画
  useEffect(() => {
    const easeOut = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

    const slideUp = (el: HTMLElement | null, delay: number) => {
      el?.animate(
        [
          { transform: "translateY(30px)", opacity: 0 },
          { transform: "translateY(0)", opacity: 1 },
        ],
        { duration: 500, delay, easing: easeOut, fill: "forwards" },
      );
    };

    slideUp(profileCardRef.current, 0);
    slideUp(passwordCardRef.current, 120);

    const cardRefs = [
      borrowCardRef.current,
      reserveCardRef.current,
      fineCardRef.current,
    ];
    cardRefs.forEach((el, i) => {
      el?.animate(
        [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }],
        {
          duration: 550,
          delay: 250 + i * 120,
          easing: easeOut,
          fill: "forwards",
        },
      );
    });
  }, []);

  // 提交修改密码
  const handleChangePassword = async () => {
    setPasswordMsg(null);

    if (!oldPassword) {
      setPasswordMsg({ type: "error", text: "请输入原密码" });
      return;
    }
    if (!newPassword) {
      setPasswordMsg({ type: "error", text: "请输入新密码" });
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMsg({ type: "error", text: "新密码长度不能少于6位" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMsg({ type: "error", text: "两次输入的新密码不一致" });
      return;
    }

    setSubmitting(true);
    try {
      const res = await changePassword({
        old_password: oldPassword,
        new_password: newPassword,
      });
      if (res.code === 200) {
        setPasswordMsg({ type: "success", text: "密码修改成功！" });
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        setPasswordMsg({
          type: "error",
          text: res.message || res.msg || "修改失败，请重试",
        });
      }
    } catch {
      setPasswordMsg({ type: "error", text: "网络错误，请稍后重试" });
    } finally {
      setSubmitting(false);
    }
  };

  // 退出登录
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 14px",
    fontSize: "14px",
    color: "#1a3a6b",
    backgroundColor: "#fff",
    border: "1px solid #d0dae8",
    borderRadius: "8px",
    outline: "none",
    boxSizing: "border-box",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <div style={{ maxWidth: "820px", margin: "0 auto", padding: "0 0 40px" }}>
      {/* 面包屑 */}
      <div style={{ marginBottom: "20px", fontSize: "13px", color: "#999" }}>
        <Link to="/home" style={{ color: "#999", textDecoration: "none" }}>
          首页
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "#333" }}>我的</span>
      </div>

      {/* ====== 个人信息卡片 ====== */}
      <div
        ref={profileCardRef}
        style={{
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #e8eef4",
          padding: "28px 32px",
          marginBottom: "20px",
          opacity: 0,
          transform: "translateY(30px)",
          boxShadow: "0 2px 12px rgba(26,58,107,0.06)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* 头像 */}
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "50%",
                backgroundColor: "#e8f4fd",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "26px",
              }}
            >
              👤
            </div>
            <div>
              <h2
                style={{
                  margin: "0 0 4px",
                  fontSize: "20px",
                  fontWeight: 600,
                  color: "#1a3a6b",
                }}
              >
                {username}
              </h2>
              <span
                style={{
                  display: "inline-block",
                  padding: "2px 12px",
                  borderRadius: "12px",
                  fontSize: "12px",
                  fontWeight: 500,
                  color: "#fff",
                  backgroundColor:
                    role === "admin"
                      ? "#e94560"
                      : role === "librarian"
                        ? "#3498db"
                        : "#27ae60",
                }}
              >
                {roleLabel[role] || role}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              padding: "8px 20px",
              fontSize: "13px",
              color: "#e94560",
              backgroundColor: "#fff",
              border: "1px solid #e94560",
              borderRadius: "8px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#e94560";
              e.currentTarget.style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#fff";
              e.currentTarget.style.color = "#e94560";
            }}
          >
            退出登录
          </button>
        </div>

        {/* 挂失按钮区域 */}
        {!lostLoading && (
          <div
            style={{
              marginTop: "20px",
              paddingTop: "18px",
              borderTop: "1px solid #f0f0f0",
            }}
          >
            <button
              onClick={handleToggleLost}
              disabled={lostSubmitting}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 22px",
                fontSize: "13px",
                fontWeight: 500,
                color: lostSubmitting
                  ? "#ccc"
                  : isLost
                    ? "#27ae60"
                    : "#e67e22",
                backgroundColor: lostSubmitting
                  ? "#fafafa"
                  : isLost
                    ? "#f0faf4"
                    : "#fff8f0",
                border: `1px solid ${
                  lostSubmitting
                    ? "#e8e8e8"
                    : isLost
                      ? "#b7ebc8"
                      : "#f0c78e"
                }`,
                borderRadius: "8px",
                cursor: lostSubmitting ? "not-allowed" : "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (lostSubmitting) return;
                e.currentTarget.style.backgroundColor = isLost
                  ? "#e6f7ec"
                  : "#fef0db";
                e.currentTarget.style.borderColor = isLost
                  ? "#27ae60"
                  : "#e67e22";
              }}
              onMouseLeave={(e) => {
                if (lostSubmitting) return;
                e.currentTarget.style.backgroundColor = isLost
                  ? "#f0faf4"
                  : "#fff8f0";
                e.currentTarget.style.borderColor = isLost
                  ? "#b7ebc8"
                  : "#f0c78e";
              }}
            >
              <span style={{ fontSize: "18px" }}>
                {isLost ? "🔓" : "🔒"}
              </span>
              {lostSubmitting
                ? isLost
                  ? "取消中…"
                  : "挂失中…"
                : isLost
                  ? "已找回？取消挂失"
                  : "卡掉了？申请挂失"}
            </button>
            {lostMsg && (
              <div
                style={{
                  marginTop: "10px",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  fontSize: "13px",
                  color: lostMsg.type === "success" ? "#27ae60" : "#e94560",
                  backgroundColor:
                    lostMsg.type === "success" ? "#f0faf4" : "#fff0f3",
                  border:
                    lostMsg.type === "success"
                      ? "1px solid #b7ebc8"
                      : "1px solid #ffccc7",
                }}
              >
                {lostMsg.text}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ====== 修改密码卡片 ====== */}
      <div
        ref={passwordCardRef}
        style={{
          background: "#fff",
          borderRadius: "12px",
          border: "1px solid #e8eef4",
          padding: "28px 32px",
          marginBottom: "32px",
          opacity: 0,
          transform: "translateY(30px)",
          boxShadow: "0 2px 12px rgba(26,58,107,0.06)",
        }}
      >
        <h3
          style={{
            margin: "0 0 20px",
            fontSize: "17px",
            fontWeight: 600,
            color: "#1a3a6b",
          }}
        >
          🔒 修改密码
        </h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            maxWidth: "400px",
          }}
        >
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "13px",
                color: "#555",
                fontWeight: 500,
              }}
            >
              原密码
            </label>
            <input
              type="password"
              placeholder="请输入原密码"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#3498db";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(52,152,219,0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#d0dae8";
                e.currentTarget.style.boxShadow = "none";
              }}
              style={inputStyle}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "13px",
                color: "#555",
                fontWeight: 500,
              }}
            >
              新密码
            </label>
            <input
              type="password"
              placeholder="请输入新密码（至少6位）"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#3498db";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(52,152,219,0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#d0dae8";
                e.currentTarget.style.boxShadow = "none";
              }}
              style={inputStyle}
            />
          </div>
          <div>
            <label
              style={{
                display: "block",
                marginBottom: "6px",
                fontSize: "13px",
                color: "#555",
                fontWeight: 500,
              }}
            >
              确认新密码
            </label>
            <input
              type="password"
              placeholder="请再次输入新密码"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#3498db";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(52,152,219,0.1)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#d0dae8";
                e.currentTarget.style.boxShadow = "none";
              }}
              style={inputStyle}
            />
          </div>
          {passwordMsg && (
            <div
              style={{
                padding: "8px 14px",
                borderRadius: "6px",
                fontSize: "13px",
                color: passwordMsg.type === "success" ? "#27ae60" : "#e94560",
                backgroundColor:
                  passwordMsg.type === "success" ? "#f0faf4" : "#fff0f3",
                border:
                  passwordMsg.type === "success"
                    ? "1px solid #b7ebc8"
                    : "1px solid #ffccc7",
              }}
            >
              {passwordMsg.text}
            </div>
          )}
          <button
            onClick={handleChangePassword}
            disabled={submitting}
            style={{
              width: "100%",
              padding: "11px 0",
              fontSize: "14px",
              fontWeight: 600,
              color: "#fff",
              backgroundColor: submitting ? "#a0b8d0" : "#1a3a6b",
              border: "none",
              borderRadius: "8px",
              cursor: submitting ? "not-allowed" : "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!submitting)
                e.currentTarget.style.backgroundColor = "#2c5aa0";
            }}
            onMouseLeave={(e) => {
              if (!submitting)
                e.currentTarget.style.backgroundColor = "#1a3a6b";
            }}
          >
            {submitting ? "提交中..." : "确认修改"}
          </button>
        </div>
      </div>

      {/* ====== 记录快捷入口卡片 ====== */}
      <h3
        style={{
          margin: "0 0 16px",
          fontSize: "17px",
          fontWeight: 600,
          color: "#1a3a6b",
        }}
      >
        📋 我的记录
      </h3>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "16px",
        }}
      >
        {/* 借阅记录卡片 */}
        <Link
          ref={borrowCardRef}
          to="/borrows"
          style={{
            textDecoration: "none",
            padding: "24px 20px",
            borderRadius: "12px",
            border: "1px solid #e8eef4",
            background: "#fff",
            clipPath: "inset(0 100% 0 0)",
            transition: "box-shadow 0.2s, transform 0.2s",
            boxShadow: "0 2px 8px rgba(26,58,107,0.04)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)";
            e.currentTarget.style.transform = "translateY(-3px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              "0 2px 8px rgba(26,58,107,0.04)";
            e.currentTarget.style.transform = "";
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>📋</div>
          <h4
            style={{
              margin: "0 0 6px",
              fontSize: "16px",
              fontWeight: 600,
              color: "#1a3a6b",
            }}
          >
            借阅记录
          </h4>
          <p style={{ margin: 0, fontSize: "13px", color: "#999" }}>
            查看当前借阅与历史记录
          </p>
        </Link>

        {/* 预约记录卡片 */}
        <Link
          ref={reserveCardRef}
          to="/reserves"
          style={{
            textDecoration: "none",
            padding: "24px 20px",
            borderRadius: "12px",
            border: "1px solid #e8eef4",
            background: "#fff",
            clipPath: "inset(0 100% 0 0)",
            transition: "box-shadow 0.2s, transform 0.2s",
            boxShadow: "0 2px 8px rgba(26,58,107,0.04)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)";
            e.currentTarget.style.transform = "translateY(-3px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              "0 2px 8px rgba(26,58,107,0.04)";
            e.currentTarget.style.transform = "";
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>📌</div>
          <h4
            style={{
              margin: "0 0 6px",
              fontSize: "16px",
              fontWeight: 600,
              color: "#1a3a6b",
            }}
          >
            预约记录
          </h4>
          <p style={{ margin: 0, fontSize: "13px", color: "#999" }}>
            管理预约与排队状态
          </p>
        </Link>

        {/* 罚款记录卡片 */}
        <Link
          ref={fineCardRef}
          to="/fines"
          style={{
            textDecoration: "none",
            padding: "24px 20px",
            borderRadius: "12px",
            border: "1px solid #e8eef4",
            background: "#fff",
            clipPath: "inset(0 100% 0 0)",
            transition: "box-shadow 0.2s, transform 0.2s",
            boxShadow: "0 2px 8px rgba(26,58,107,0.04)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 6px 20px rgba(0,0,0,0.12)";
            e.currentTarget.style.transform = "translateY(-3px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow =
              "0 2px 8px rgba(26,58,107,0.04)";
            e.currentTarget.style.transform = "";
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "12px" }}>💰</div>
          <h4
            style={{
              margin: "0 0 6px",
              fontSize: "16px",
              fontWeight: 600,
              color: "#1a3a6b",
            }}
          >
            罚款记录
          </h4>
          <p style={{ margin: 0, fontSize: "13px", color: "#999" }}>
            查看罚款明细与缴费
          </p>
        </Link>
      </div>
    </div>
  );
}
