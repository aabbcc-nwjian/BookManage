import { useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import useBookStore from "../../store/books";
import { getBookCoverUrl } from "../../api";
import coverDefault from "../../img/threeBody.jpg";

const CATEGORY_COLOR: Record<string, string> = {
  科幻: "#3498db",
  文学: "#e74c3c",
  技术: "#27ae60",
  古典文学: "#8e44ad",
  历史: "#e67e22",
};

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // 从 Zustand store 获取所有图书
  const books = useBookStore((state) => state.books);
  const book = id ? books.find((b) => b.id === Number(id)) : undefined;

  // "大家都在看"：从 store 中按 borrow_count 降序排列，排除当前图书，取前 3 本
  const topRated = useMemo(() => {
    if (!book || books.length === 0) return [];
    return [...books]
      .filter((b) => b.id !== book.id)
      .sort((a, b) => (b.borrow_count ?? 0) - (a.borrow_count ?? 0))
      .slice(0, 3);
  }, [books, book]);

  // "猜你喜欢"：从 store 中筛选同分类图书，排除当前图书，取前 3 本
  const youMayLike = useMemo(() => {
    if (!book || books.length === 0) return [];
    return books
      .filter((b) => b.id !== book.id && b.category === book.category)
      .slice(0, 3);
  }, [books, book]);

  if (!book) {
    return (
      <div style={{ textAlign: "center", padding: "80px 0" }}>
        <div style={{ fontSize: "48px", marginBottom: "16px" }}>📭</div>
        <h2 style={{ color: "#666", marginBottom: "8px" }}>未找到该图书</h2>
        <p style={{ color: "#999", marginBottom: "24px" }}>
          图书 ID: {id} 不存在或已被删除
        </p>
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

  const displayRating = book.borrow_count ?? 0;

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "0 auto",
        paddingBottom: "48px",
        display: "flex",
        gap: "24px",
        alignItems: "flex-start",
      }}
    >
      {/* ====== 左侧：主内容区 ====== */}
      <div style={{ flex: 1, minWidth: 0 }}>
        {/* 面包屑导航 */}
        <div style={{ marginBottom: "20px", fontSize: "13px", color: "#999" }}>
          <Link to="/home" style={{ color: "#999", textDecoration: "none" }}>
            首页
          </Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <Link to="/books" style={{ color: "#999", textDecoration: "none" }}>
            图书列表
          </Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "#333" }}>{book.title}</span>
        </div>

        {/* 图书详情卡片 */}
        <div
          style={{
            background: "#fff",
            borderRadius: "12px",
            border: "2px solid #3498db",
            overflow: "hidden",
            marginBottom: "32px",
            display: "flex",
            alignItems: "stretch",
          }}
        >
          {/* 竖式封面 */}
          <div
            style={{
              margin: "10px",
              width: "300px",
              flexShrink: 0,
              background: `url(${book.has_cover ? getBookCoverUrl(book.id) : coverDefault}) center / cover no-repeat`,
              backgroundColor: "#d0dce8",
            }}
          />

          <div style={{ flex: 1, padding: "28px 32px", minWidth: 0 }}>
            {/* 标题行 + 热度 */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                marginBottom: "6px",
                gap: "12px",
              }}
            >
              <h1
                style={{
                  fontSize: "24px",
                  color: "#1a3a6b",
                  margin: 0,
                }}
              >
                {book.title}
              </h1>

              {/* 热度展示 */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "6px 14px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: "#e74c3c",
                  backgroundColor: "#fff",
                  border: "2px solid #e74c3c",
                  borderRadius: "20px",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                </svg>
                {displayRating}
              </div>
            </div>

            <p style={{ color: "#888", fontSize: "15px", margin: "0 0 20px" }}>
              {book.author} · {book.published_date}
            </p>

            {/* 信息表格 */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "16px",
                padding: "20px 0",
                borderTop: "1px solid #dce8f4",
                borderBottom: "1px solid #dce8f4",
                marginBottom: "24px",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#999",
                    marginBottom: "4px",
                  }}
                >
                  ISBN
                </div>
                <div style={{ fontSize: "14px", color: "#333" }}>
                  {book.isbn}
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#999",
                    marginBottom: "4px",
                  }}
                >
                  分类
                </div>
                <span
                  style={{
                    fontSize: "12px",
                    color: "#fff",
                    backgroundColor: CATEGORY_COLOR[book.category] || "#3498db",
                    padding: "3px 12px",
                    borderRadius: "10px",
                    fontWeight: 500,
                  }}
                >
                  {book.category}
                </span>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#999",
                    marginBottom: "4px",
                  }}
                >
                  页数
                </div>
                <div style={{ fontSize: "14px", color: "#333" }}>
                  {book.pages} 页
                </div>
              </div>
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#999",
                    marginBottom: "4px",
                  }}
                >
                  出版年份
                </div>
                <div style={{ fontSize: "14px", color: "#333" }}>
                  {book.published_date}
                </div>
              </div>
            </div>

            {/* 简介 */}
            <div style={{ marginBottom: "28px" }}>
              <h3
                style={{
                  fontSize: "16px",
                  color: "#1a3a6b",
                  marginBottom: "10px",
                }}
              >
                内容简介
              </h3>
              <p
                style={{
                  fontSize: "14px",
                  color: "#555",
                  lineHeight: 1.8,
                  margin: 0,
                }}
              >
                {book.description}
              </p>
            </div>

            {/* 操作按钮 */}
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                onClick={() => {
                  if (book.status === "可借阅") {
                    navigate(`/books/${book.id}/borrow`);
                  } else {
                    navigate(`/books/${book.id}/reserve`);
                  }
                }}
                style={{
                  padding: "10px 24px",
                  fontSize: "14px",
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
                📋 借阅/预约
              </button>

              <button
                onClick={() => navigate("/books")}
                style={{
                  padding: "10px 24px",
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
                ← 返回列表
              </button>

              <button
                onClick={() => navigate(-1)}
                style={{
                  padding: "10px 24px",
                  fontSize: "14px",
                  color: "#fff",
                  backgroundColor: "#1a3a6b",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  transition: "background-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#2471a3")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#1a3a6b")
                }
              >
                返回上一页
              </button>
            </div>
          </div>
        </div>

        {/* ====== 大家都在看 ====== */}
        {topRated.length > 0 && (
          <div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "4px",
                  height: "20px",
                  backgroundColor: "#3498db",
                  borderRadius: "2px",
                }}
              />
              <h3
                style={{
                  fontSize: "18px",
                  color: "#1a3a6b",
                  margin: 0,
                }}
              >
                🔥 大家都在看
              </h3>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: "14px",
              }}
            >
              {topRated.map((b) => (
                <Link
                  key={b.id}
                  to={`/books/${b.id}`}
                  style={{
                    textDecoration: "none",
                    background: "#fff",
                    borderRadius: "10px",
                    border: "1px solid #d0dff0",
                    overflow: "hidden",
                    transition: "box-shadow 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 18px rgba(52,152,219,0.2)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "";
                    e.currentTarget.style.transform = "";
                  }}
                >
                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      background: `url(${b.has_cover ? getBookCoverUrl(b.id) : coverDefault}) center / cover no-repeat`,
                      backgroundColor: "#d0dce8",
                    }}
                  />
                  <div style={{ padding: "12px 14px" }}>
                    <div
                      style={{
                        fontSize: "14px",
                        fontWeight: 600,
                        color: "#1a3a6b",
                        marginBottom: "4px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {b.title}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: "12px", color: "#999" }}>
                        {b.author}
                      </span>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "2px",
                          fontSize: "12px",
                          color: "#e74c3c",
                        }}
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                        </svg>
                        {b.borrow_count}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ====== 右侧：猜你喜欢 ====== */}
      {youMayLike.length > 0 && (
        <aside style={{ width: "280px", flexShrink: 0 }}>
          <div
            style={{
              position: "sticky",
              top: "20px",
            }}
          >
            {/* 标题 */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginBottom: "16px",
              }}
            >
              <div
                style={{
                  width: "4px",
                  height: "22px",
                  backgroundColor: "#e94560",
                  borderRadius: "2px",
                }}
              />
              <h3
                style={{
                  fontSize: "18px",
                  color: "#1a3a6b",
                  margin: 0,
                }}
              >
                💡 猜你喜欢
              </h3>
            </div>

            {/* 图书列表（竖向排列，竖式卡片） */}
            <div
              style={{ display: "flex", flexDirection: "column", gap: "16px" }}
            >
              {youMayLike.map((b) => (
                <Link
                  key={b.id}
                  to={`/books/${b.id}`}
                  style={{
                    textDecoration: "none",
                    background: "#fff",
                    borderRadius: "10px",
                    border: "1px solid #e8e8e8",
                    overflow: "hidden",
                    transition: "box-shadow 0.2s, transform 0.2s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow =
                      "0 4px 18px rgba(233,69,96,0.15)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = "";
                    e.currentTarget.style.transform = "";
                  }}
                >
                  {/* 竖式封面 */}
                  <div
                    style={{
                      width: "100%",
                      height: "200px",
                      background: `url(${b.has_cover ? getBookCoverUrl(b.id) : coverDefault}) center / cover no-repeat`,
                      backgroundColor: "#d0dce8",
                    }}
                  />
                  {/* 信息 */}
                  <div style={{ padding: "14px 16px" }}>
                    <div
                      style={{
                        fontSize: "15px",
                        fontWeight: 600,
                        color: "#1a3a6b",
                        marginBottom: "6px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {b.title}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontSize: "13px", color: "#999" }}>
                        {b.author}
                      </span>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#e74c3c",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
                        </svg>
                        {b.borrow_count}
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      )}
    </div>
  );
}
