import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getAllBooks, getApiBookById } from "../../data/books";
import { getBookCoverUrl } from "../../api";
import coverDefault from "../../img/threeBody.jpg";
import {
  getRecommendationsByCategory,
  getRecommendationsForReader,
} from "../../api";
import type { Book } from "../../api";

const books = getAllBooks();

const CATEGORY_COLOR: Record<string, string> = {
  科幻: "#3498db",
  文学: "#e74c3c",
  技术: "#27ae60",
  古典文学: "#8e44ad",
  历史: "#e67e22",
};

/** "猜你喜欢"，之后从后端get */
function getYouMayLike(currentId: string, count: number) {
  const others = books.filter((b) => b.id !== currentId);
  // 用 id 的 charCode 之和作为种子做确定性打乱，方便调试
  const seed = [...currentId].reduce((s, c) => s + c.charCodeAt(0), 0);
  const shuffled = [...others].sort((a, b) => {
    const ha = (a.id.charCodeAt(0) * seed) % 13;
    const hb = (b.id.charCodeAt(0) * seed) % 13;
    return ha - hb;
  });
  return shuffled.slice(0, count);
}

export default function BookDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(false);
  const [categoryBooks, setCategoryBooks] = useState<Book[]>([]);
  const [readerBooks, setReaderBooks] = useState<Book[]>([]);

  const book = id ? getApiBookById(id) : undefined;
  useEffect(() => {
    getRecommendationsByCategory({
      category: book?.category || "",
    }).then((res) => {
      console.log("分类推荐:", res.data.items);
      setCategoryBooks(res.data.items);
    });
    getRecommendationsForReader(1).then((res) => {
      console.log("读者推荐:", res.data.items);
      setReaderBooks(res.data.items);
    });
  }, [book?.category]);

  // "大家都在看"：排除当前图书，取推荐指数最高的 3 本
  const topRated = categoryBooks.filter((b) => b.id !== Number(id)).slice(0, 3);

  // "猜你喜欢"：基于当前图书 ID 的伪随机推荐（TODO: 后续接入真实推荐算法）
  const youMayLike = readerBooks.filter((b) => b.id !== Number(id)).slice(0, 3);

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

  const displayRating = book.borrow_count || 0 + (liked ? 1 : 0);

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
            {/* 标题行 + 推荐指数 */}
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

              {/* 可点击的推荐指数 */}
              <button
                onClick={() => setLiked((v) => !v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "6px 14px",
                  fontSize: "14px",
                  fontWeight: 600,
                  color: liked ? "#fff" : "#e74c3c",
                  backgroundColor: liked ? "#e74c3c" : "#fff",
                  border: liked ? "none" : "2px solid #e74c3c",
                  borderRadius: "20px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  flexShrink: 0,
                }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill={liked ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                  <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
                </svg>
                {displayRating}
              </button>
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
                      background: `url(${coverDefault}) center / cover no-repeat`,
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
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
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
                      background: `url(${coverDefault}) center / cover no-repeat`,
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
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
                          <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
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
