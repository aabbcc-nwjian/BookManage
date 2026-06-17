import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getApiBookById } from "../../data/books";
import coverDefault from "../../img/threeBody.jpg";
import { reserveBook } from "../../api/books";

export default function ReservePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const book = id ? getApiBookById(id) : undefined;

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
  const userid = Number(localStorage.getItem("reader_id"));
  const handleSubmit = () => {
    reserveBook({ book_id: book.id, reader_id: userid }).then((res) => {
      console.log(res);
      setSubmitted(true);
    });
  };

  if (submitted) {
    return (
      <div
        style={{ maxWidth: "560px", margin: "0 auto", paddingBottom: "48px" }}
      >
        <div
          style={{
            textAlign: "center",
            background: "#fff",
            borderRadius: "12px",
            border: "2px solid #3498db",
            padding: "48px 32px",
            marginTop: "20px",
          }}
        >
          <div style={{ fontSize: "56px", marginBottom: "16px" }}>📝</div>
          <h2 style={{ color: "#3498db", margin: "0 0 24px" }}>预约成功！</h2>

          <div
            style={{
              background: "#f0f6fc",
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
              <span style={infoLabelStyle}>作者</span>
              <span style={infoValueStyle}>{book.author}</span>
            </div>
            <div style={infoRowStyle}>
              <span style={infoLabelStyle}>ISBN</span>
              <span style={infoValueStyle}>{book.isbn}</span>
            </div>
            <div
              style={{
                ...infoRowStyle,
                borderBottom: "none",
                paddingBottom: 0,
              }}
            >
              <span style={infoLabelStyle}>预约日期</span>
              <span style={infoValueStyle}>
                {new Date().toISOString().split("T")[0]}
              </span>
            </div>
          </div>

          <p style={{ fontSize: "14px", color: "#e67e22", margin: "0 0 24px" }}>
            ⚠️ 书到后会通知您，请在通知后两个星期之内来取
          </p>

          <div
            style={{ display: "flex", gap: "12px", justifyContent: "center" }}
          >
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
        <span style={{ color: "#333" }}>预约</span>
      </div>

      <h2 style={{ fontSize: "22px", color: "#1a3a6b", margin: "0 0 20px" }}>
        📋 预约
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
          <div
            style={{
              fontSize: "16px",
              fontWeight: 600,
              color: "#1a3a6b",
              marginBottom: "4px",
            }}
          >
            {book.title}
          </div>
          <div style={{ fontSize: "13px", color: "#888" }}>
            {book.author} · {book.published_date}
          </div>
          <div style={{ fontSize: "12px", color: "#999", marginTop: "2px" }}>
            ISBN {book.isbn}
          </div>
          <span
            style={{
              display: "inline-block",
              marginTop: "6px",
              fontSize: "12px",
              color: "#e94560",
              backgroundColor: "#fdecea",
              padding: "2px 10px",
              borderRadius: "8px",
            }}
          >
            {book.status}
          </span>
        </div>
      </div>

      {/* 提示信息 */}
      <div
        style={{
          textAlign: "center",
          background: "#fff",
          borderRadius: "10px",
          border: "1px solid #d0dff0",
          padding: "40px 24px",
        }}
      >
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>😔</div>
        <p
          style={{
            fontSize: "17px",
            color: "#555",
            lineHeight: 1.8,
            margin: "0 0 8px",
          }}
        >
          不好意思，书借完了，是否预约？
        </p>
        <p
          style={{
            fontSize: "13px",
            color: "#999",
            margin: "0 0 32px",
          }}
        >
          预约后书到会第一时间通知您
        </p>

        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
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
            style={{
              flex: 1,
              padding: "12px 24px",
              fontSize: "15px",
              fontWeight: 600,
              color: "#fff",
              backgroundColor: "#e94560",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              transition: "background-color 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#d63851")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#e94560")
            }
          >
            确认预约
          </button>
        </div>
      </div>
    </div>
  );
}

const infoRowStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "8px 0",
  borderBottom: "1px solid #d5e4f0",
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
