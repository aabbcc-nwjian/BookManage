import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getBookById } from "../../data/books";
import coverDefault from "../../img/threeBody.jpg";

const DURATION_OPTIONS = [
  { label: "1 周", value: 7, desc: "7 天" },
  { label: "1 月", value: 30, desc: "30 天" },
  { label: "3 月", value: 90, desc: "90 天" },
] as const;

const todayStr = new Date().toISOString().split("T")[0];

export default function BorrowPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const book = id ? getBookById(id) : undefined;

  const [reserveDate, setReserveDate] = useState(todayStr);
  const [duration, setDuration] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  if (!book) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
        <h2 style={{ color: "#666", marginBottom: "8px" }}>未找到该图书</h2>
        <button
          onClick={() => navigate("/books")}
          style={{
            padding: "10px 24px",
            fontSize: "14px",
            color: "#fff",
            backgroundColor: "#e94560",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          返回图书列表
        </button>
      </div>
    );
  }

  const canSubmit = reserveDate && duration !== null;

  const handleSubmit = () => {
    if (!canSubmit) return;
    setSubmitted(true);
  };

  if (submitted) {
    const selectedDuration = DURATION_OPTIONS.find((d) => d.value === duration);
    const reserve = new Date(reserveDate);
    reserve.setDate(reserve.getDate() + duration!);
    const returnDate = reserve.toISOString().split("T")[0];

    return (
      <div style={{ maxWidth: "560px", margin: "0 auto", paddingBottom: "48px" }}>
        <div
          style={{
            textAlign: "center",
            background: "#fff",
            borderRadius: "12px",
            border: "2px solid #27ae60",
            padding: "48px 32px",
            marginTop: "20px",
          }}
        >
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>✅</div>
          <h2 style={{ color: "#27ae60", margin: "0 0 24px" }}>预约成功！</h2>

          <div
            style={{
              background: "#f0faf4",
              borderRadius: "8px",
              padding: "20px",
              textAlign: "left",
              marginBottom: "28px",
            }}
          >
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>图书</span>
              <span style={infoValueStyle}>{book.title}</span>
            </div>
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>预约时间</span>
              <span style={infoValueStyle}>{reserveDate}</span>
            </div>
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>借阅时长</span>
              <span style={infoValueStyle}>{selectedDuration?.label}</span>
            </div>
            <div style={{ ...infoRowStyle, borderBottom: "none", paddingBottom: 0 }}>
              <span style={infoLabelStyle}>应还日期</span>
              <span style={{ ...infoValueStyle, color: "#e94560", fontWeight: 600 }}>
                {returnDate}
              </span>
            </div>
          </div>

          <p style={{ fontSize: "14px", color: "#e67e22", margin: "0 0 24px" }}>
            ⚠️ 请在两个星期之内来取
          </p>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <button
              onClick={() => navigate(`/books/${book.id}`)}
              style={{
                padding: "10px 24px",
                fontSize: "14px",
                color: "#333",
                backgroundColor: "#fff",
                border: "1px solid #d9d9d9",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              ← 返回详情
            </button>
            <button
              onClick={() => navigate("/books")}
              style={{
                padding: "10px 24px",
                fontSize: "14px",
                color: "#fff",
                backgroundColor: "#1a3a6b",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              返回图书列表
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", paddingBottom: "48px" }}>
      {/* 面包屑 */}
      <div style={{ marginBottom: "20px", fontSize: "13px", color: "#999" }}>
        <Link to="/home" style={{ color: "#999", textDecoration: "none" }}>
          首页
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <Link to="/books" style={{ color: "#999", textDecoration: "none" }}>
          图书列表
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <Link
          to={`/books/${book.id}`}
          style={{ color: "#999", textDecoration: "none" }}
        >
          {book.title}
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "#333" }}>借阅预约</span>
      </div>

      <h2 style={{ fontSize: "22px", color: "#1a3a6b", margin: "0 0 20px" }}>
        📋 借阅预约
      </h2>

      {/* 图书信息卡片 */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          background: "#fff",
          borderRadius: "10px",
          border: "1px solid #d0dff0",
          padding: "16px",
          marginBottom: "20px",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: "60px",
            height: "85px",
            flexShrink: 0,
            background: `url(${coverDefault}) center / cover no-repeat`,
            backgroundColor: "#d0dce8",
            borderRadius: "4px",
          }}
        />
        <div>
          <div style={{ fontSize: "16px", fontWeight: 600, color: "#1a3a6b", marginBottom: "4px" }}>
            {book.title}
          </div>
          <div style={{ fontSize: "13px", color: "#888" }}>
            {book.author} · {book.year}
          </div>
          <div style={{ fontSize: "12px", color: "#999", marginTop: "2px" }}>
            ISBN {book.isbn}
          </div>
          <span
            style={{
              display: "inline-block",
              marginTop: "6px",
              fontSize: "12px",
              color: book.status === "可借" ? "#27ae60" : "#e94560",
              backgroundColor: book.status === "可借" ? "#e8f8ef" : "#fdecea",
              padding: "2px 10px",
              borderRadius: "8px",
            }}
          >
            {book.status}
          </span>
        </div>
      </div>

      {/* 取书提醒 */}
      <div
        style={{
          background: "#fef9e7",
          borderRadius: "8px",
          padding: "12px 16px",
          marginBottom: "20px",
          fontSize: "14px",
          color: "#7d6608",
        }}
      >
        ⚠️ 请在两个星期之内来取
      </div>

      {/* 预约表单 */}
      <div
        style={{
          background: "#fff",
          borderRadius: "10px",
          border: "1px solid #d0dff0",
          padding: "24px",
        }}
      >
        {/* 预约时间 */}
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 600,
              color: "#1a3a6b",
              marginBottom: "8px",
            }}
          >
            📅 预约时间
          </label>
          <input
            type="date"
            value={reserveDate}
            min={todayStr}
            onChange={(e) => setReserveDate(e.target.value)}
            style={inputStyle}
          />
          <div style={{ fontSize: "12px", color: "#999", marginTop: "4px" }}>
            默认今天，可自行调整
          </div>
        </div>

        {/* 借阅时长 */}
        <div style={{ marginBottom: "24px" }}>
          <label
            style={{
              display: "block",
              fontSize: "14px",
              fontWeight: 600,
              color: "#1a3a6b",
              marginBottom: "8px",
            }}
          >
            ⏱️ 借阅时长
          </label>
          <div style={{ display: "flex", gap: "10px" }}>
            {DURATION_OPTIONS.map((opt) => {
              const isSelected = duration === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setDuration(opt.value)}
                  style={{
                    flex: 1,
                    padding: "14px 12px",
                    fontSize: "15px",
                    fontWeight: isSelected ? 700 : 500,
                    color: isSelected ? "#fff" : "#1a3a6b",
                    backgroundColor: isSelected ? "#3498db" : "#f0f6fc",
                    border: isSelected
                      ? "2px solid #3498db"
                      : "2px solid #d0dff0",
                    borderRadius: "8px",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "#3498db";
                      e.currentTarget.style.backgroundColor = "#e8f4fd";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) {
                      e.currentTarget.style.borderColor = "#d0dff0";
                      e.currentTarget.style.backgroundColor = "#f0f6fc";
                    }
                  }}
                >
                  <div>{opt.label}</div>
                  <div
                    style={{
                      fontSize: "11px",
                      fontWeight: 400,
                      opacity: 0.7,
                      marginTop: "2px",
                    }}
                  >
                    {opt.desc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 应还日期预览 */}
        {reserveDate && duration !== null && (
          <div
            style={{
              background: "#fef9e7",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "20px",
              fontSize: "14px",
              color: "#7d6608",
            }}
          >
            📌 预计应还日期：
            <strong style={{ color: "#e94560" }}>
              {(() => {
                const d = new Date(reserveDate);
                d.setDate(d.getDate() + duration);
                return d.toISOString().split("T")[0];
              })()}
            </strong>
          </div>
        )}

        {/* 操作按钮 */}
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={() => navigate(`/books/${book.id}`)}
            style={{
              padding: "12px 24px",
              fontSize: "14px",
              color: "#333",
              backgroundColor: "#fff",
              border: "1px solid #d9d9d9",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "#3498db";
              e.currentTarget.style.color = "#3498db";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "#d9d9d9";
              e.currentTarget.style.color = "#333";
            }}
          >
            ← 返回详情
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            style={{
              flex: 1,
              padding: "12px 24px",
              fontSize: "15px",
              fontWeight: 600,
              color: "#fff",
              backgroundColor: canSubmit ? "#e94560" : "#ccc",
              border: "none",
              borderRadius: "6px",
              cursor: canSubmit ? "pointer" : "not-allowed",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) => {
              if (canSubmit)
                e.currentTarget.style.backgroundColor = "#d63851";
            }}
            onMouseLeave={(e) => {
              if (canSubmit)
                e.currentTarget.style.backgroundColor = "#e94560";
            }}
          >
            确认预约
          </button>
        </div>
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  fontSize: "15px",
  color: "#1a3a6b",
  backgroundColor: "#f8fafc",
  border: "2px solid #d0dff0",
  borderRadius: "8px",
  outline: "none",
  boxSizing: "border-box",
  transition: "border-color 0.2s",
};

const infoRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 0",
  borderBottom: "1px solid #d5f0dc",
};

const infoLabelStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#888",
};

const infoValueStyle: React.CSSProperties = {
  fontSize: "13px",
  color: "#333",
  fontWeight: 500,
};
