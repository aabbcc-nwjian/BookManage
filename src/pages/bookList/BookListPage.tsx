import { useState, useMemo, useRef, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
//import { getAllBooks } from "../../data/books";
//import type { Book } from "../../data/books";
import bgImage from "../../img/bookList.png";
import coverDefault from "../../img/threeBody.jpg";
import { getBookList } from "../../api";
import type { Book } from "../../api";
import useBookStore from "../../store/books";

//const books = getAllBooks();
//const allCategories = [...new Set(books.map((b) => b.category))];

const CATEGORY_COLOR: Record<string, string> = {
  科幻: "#3498db",
  文学: "#e74c3c",
  技术: "#27ae60",
  古典文学: "#8e44ad",
  历史: "#e67e22",
};

const HISTORY_KEY = "bookSearchHistory";
const MAX_HISTORY = 8;

function loadHistory(): string[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveHistory(history: string[]) {
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
}

export default function BookListPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get("q") || "";
  const [search, setSearch] = useState(initialSearch);
  const [category, setCategory] = useState("全部");
  const [statusFilter] = useState("全部");
  const [history, setHistory] = useState<string[]>(loadHistory);
  const [showHistory, setShowHistory] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardListRef = useRef<HTMLDivElement>(null);
  const books = useBookStore((state) => state.books);
  const allCategories = useBookStore((state) => state.allCategories);
  const setBooks = useBookStore((state) => state.setBooks);

  useEffect(() => {
    getBookList().then((res) => {
      const nextBooks = res.data.items;
      setBooks(nextBooks);
      console.log(res, nextBooks);
    });
  }, [setBooks]);

  // 当搜索词变化时同步更新 URL 参数
  useEffect(() => {
    if (search.trim()) {
      setSearchParams({ q: search.trim() }, { replace: true });
    } else {
      setSearchParams({}, { replace: true });
    }
  }, [search, setSearchParams]);

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowHistory(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // 按回车时记录搜索历史
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && search.trim()) {
      commitSearch(search.trim());
    }
  };

  const commitSearch = (term: string) => {
    setHistory((prev) => {
      const next = [term, ...prev.filter((h) => h !== term)].slice(
        0,
        MAX_HISTORY,
      );
      saveHistory(next);
      return next;
    });
    setShowHistory(false);
  };

  const clearHistory = () => {
    setHistory([]);
    saveHistory([]);
    setShowHistory(false);
  };

  const filtered = useMemo(() => {
    return books.filter((book) => {
      const matchSearch =
        !search ||
        book.title.includes(search) ||
        book.author.includes(search) ||
        book.isbn.includes(search);
      const matchCategory = category === "全部" || book.category === category;
      return matchSearch && matchCategory;
    });
  }, [books, search, category, statusFilter]);

  // 书籍卡片从左到右展开动画
  useEffect(() => {
    const container = cardListRef.current;
    if (!container) return;
    const cards = container.children;
    const easeOut = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";
    Array.from(cards).forEach((card, i) => {
      (card as HTMLElement).animate(
        [
          { clipPath: "inset(0 100% 0 0)", opacity: 0 },
          { clipPath: "inset(0 0 0 0)", opacity: 1 },
        ],
        { duration: 500, delay: i * 80, easing: easeOut, fill: "forwards" },
      );
    });
  }, [filtered]);

  return (
    <div
      style={{
        width: "100vw",
        marginTop: "-56px",
        marginBottom: "-24px",
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)",
        minHeight: "100vh",
        background: `url(${bgImage}) center / cover no-repeat`,
        backgroundAttachment: "fixed",
        padding: "32px 24px 48px",
      }}
    >
      {/* 内容区 */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          maxWidth: "960px",
          margin: "0 auto",
        }}
      >
        {/* 面包屑 */}
        <div
          style={{
            marginBottom: "20px",
            fontSize: "13px",
            color: "rgba(255,255,255,0.7)",
          }}
        >
          <Link
            to="/home"
            style={{ color: "rgba(255,255,255,0.6)", textDecoration: "none" }}
          >
            首页
          </Link>
          <span style={{ margin: "0 8px" }}>/</span>
          <span style={{ color: "rgba(255,255,255,0.9)" }}>图书列表</span>
        </div>

        <h2 style={{ fontSize: "22px", color: "#fff", margin: "0 0 20px" }}>
          📖 图书列表
        </h2>

        {/* 搜索栏 + 筛选 */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          {/* 搜索框容器（用于下拉定位） */}
          <div
            ref={wrapperRef}
            style={{ flex: "1 1 320px", position: "relative" }}
          >
            <div
              style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
              }}
            >
              {/* 搜索图标 */}
              <span
                style={{
                  position: "absolute",
                  left: "16px",
                  fontSize: "18px",
                  color: "#a0b8d0",
                  pointerEvents: "none",
                  zIndex: 1,
                }}
              >
                🔍
              </span>
              <input
                type="text"
                placeholder="搜索书名 / 作者 / ISBN..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#3498db";
                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(52,152,219,0.12)";
                  if (history.length > 0) setShowHistory(true);
                }}
                style={{
                  flex: 1,
                  width: "100%",
                  padding: "14px 16px 14px 48px",
                  fontSize: "16px",
                  color: "#333",
                  backgroundColor: "#fff",
                  border: "2px solid #c8d8e8",
                  borderRadius: "10px",
                  outline: "none",
                  boxSizing: "border-box",
                  transition: "border-color 0.2s, box-shadow 0.2s",
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#c8d8e8";
                  e.currentTarget.style.boxShadow = "";
                }}
              />
              {/* 清除按钮 */}
              {search && (
                <button
                  onClick={() => setSearch("")}
                  style={{
                    position: "absolute",
                    right: "12px",
                    background: "none",
                    border: "none",
                    fontSize: "18px",
                    color: "#aaa",
                    cursor: "pointer",
                    padding: "4px",
                    lineHeight: 1,
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* 历史记录下拉菜单 */}
            {showHistory && history.length > 0 && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 4px)",
                  left: 0,
                  right: 0,
                  background: "#fff",
                  borderRadius: "10px",
                  border: "1px solid #d8e4f0",
                  boxShadow: "0 6px 20px rgba(26,58,107,0.15)",
                  zIndex: 10,
                  overflow: "hidden",
                }}
              >
                {/* 下拉头部 */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 16px",
                    borderBottom: "1px solid #f0f4f8",
                  }}
                >
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#8aa0b8",
                      fontWeight: 500,
                    }}
                  >
                    搜索历史
                  </span>
                  <button
                    onClick={clearHistory}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "12px",
                      color: "#a0b8d0",
                      cursor: "pointer",
                      padding: "2px 6px",
                      borderRadius: "4px",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#e94560")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "#a0b8d0")
                    }
                  >
                    清空记录
                  </button>
                </div>
                {/* 历史项列表 */}
                {history.map((term, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      setSearch(term);
                      setShowHistory(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      padding: "10px 16px",
                      fontSize: "14px",
                      color: "#2c3e50",
                      cursor: "pointer",
                      transition: "background-color 0.15s",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.backgroundColor = "#eef5fb")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.backgroundColor = "")
                    }
                  >
                    <span style={{ fontSize: "13px", color: "#c0d0e0" }}>
                      🕐
                    </span>
                    <span style={{ flex: 1 }}>{term}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{
              padding: "13px 14px",
              fontSize: "15px",
              color: "#333",
              backgroundColor: "#fff",
              border: "2px solid #c8d8e8",
              borderRadius: "10px",
              outline: "none",
              cursor: "pointer",
              minWidth: "130px",
            }}
          >
            <option value="全部">全部分类</option>
            {allCategories.map((c) => {
              const color = CATEGORY_COLOR[c] || "#3498db";
              return (
                <option
                  key={c}
                  value={c}
                  style={{
                    color,
                    fontWeight: 600,
                  }}
                >
                  {c}
                </option>
              );
            })}
          </select>
        </div>

        {/* 结果统计 */}
        <div
          style={{
            fontSize: "13px",
            color: "rgba(255,255,255,0.7)",
            marginBottom: "16px",
          }}
        >
          共 {filtered.length} 本图书
        </div>

        {/* 图书卡片列表（单列） */}
        {filtered.length > 0 ? (
          <div
            ref={cardListRef}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            {filtered.map((book: Book) => (
              <Link
                key={book.id}
                to={`/books/${book.id}`}
                style={{
                  textDecoration: "none",
                  display: "flex",
                  alignItems: "stretch",
                  borderRadius: "12px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  background: "rgba(255,255,255,0.94)",
                  overflow: "hidden",
                  clipPath: "inset(0 100% 0 0)",
                  opacity: 0,
                  transition: "box-shadow 0.2s, transform 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow =
                    "0 6px 24px rgba(0,0,0,0.18)";
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = "";
                  e.currentTarget.style.transform = "";
                }}
              >
                {/* 封面 */}
                <div
                  style={{
                    width: "120px",
                    minHeight: "160px",
                    flexShrink: 0,
                    background: `url(${coverDefault}) center / cover no-repeat`,
                    backgroundColor: "#e0e8f0",
                  }}
                />

                {/* 图书信息 */}
                <div
                  style={{
                    flex: 1,
                    padding: "18px 22px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  {/* 上半部分 */}
                  <div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        marginBottom: "6px",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "20px",
                          fontWeight: 700,
                          color: "#1a3a6b",
                          margin: 0,
                        }}
                      >
                        {book.title}
                      </h3>
                      {/* 推荐指数 */}
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "3px",
                          fontSize: "13px",
                          color: "#e74c3c",
                          flexShrink: 0,
                          marginLeft: "12px",
                        }}
                      >
                        <svg
                          width="15"
                          height="15"
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
                        {book.borrow_count}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "black",
                        margin: "0 0 8px",
                      }}
                    >
                      {book.author} · {book.published_date}
                    </p>
                    <p
                      style={{
                        fontSize: "13px",
                        color: "#999",
                        lineHeight: 1.6,
                        margin: 0,
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {book.description}
                    </p>
                  </div>

                  {/* 底部信息 */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "18px",
                      marginTop: "8px",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "12px",
                        color: "#fff",
                        backgroundColor:
                          CATEGORY_COLOR[book.category] || "#3498db",
                        padding: "2px 10px",
                        borderRadius: "10px",
                      }}
                    >
                      {book.category}
                    </span>
                    <div style={{ flex: 1 }} />
                    <span style={{ fontSize: "12px", color: "black" }}>
                      {book.pages} 页
                    </span>
                    <span style={{ fontSize: "12px", color: "#aaa" }}>
                      ISBN {book.isbn.slice(-7)}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div
            style={{
              textAlign: "center",
              padding: "60px 0",
              color: "#ccc",
              fontSize: "14px",
            }}
          >
            📭 未找到匹配的图书
          </div>
        )}
      </div>
    </div>
  );
}
