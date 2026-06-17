import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import bgImage from "../../img/library3.png";

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const welcomeCardRef = useRef<HTMLDivElement>(null);
  const welcomeIconRef = useRef<HTMLDivElement>(null);
  const welcomeTitleRef = useRef<HTMLHeadingElement>(null);
  const welcomeSubtitleRef = useRef<HTMLParagraphElement>(null);
  const welcomeSearchRef = useRef<HTMLDivElement>(null);
  const bookListCardRef = useRef<HTMLAnchorElement>(null);
  const borrowCardRef = useRef<HTMLAnchorElement>(null);
  const reserveCardRef = useRef<HTMLAnchorElement>(null);
  const fineCardRef = useRef<HTMLAnchorElement>(null);

  // 页面入场动画
  useEffect(() => {
    const easeOut = "cubic-bezier(0.25, 0.46, 0.45, 0.94)";

    // 欢迎卡片整体从左到右展开
    welcomeCardRef.current?.animate(
      [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }],
      { duration: 700, easing: easeOut, fill: "forwards" },
    );

    // 欢迎卡片内容依次从左滑入 + 淡入
    const slideIn = (el: HTMLElement | null, delay: number) => {
      el?.animate(
        [
          { transform: "translateX(-50px)", opacity: 0 },
          { transform: "translateX(0)", opacity: 1 },
        ],
        { duration: 500, delay, easing: easeOut, fill: "forwards" },
      );
    };
    slideIn(welcomeIconRef.current, 150);
    slideIn(welcomeTitleRef.current, 280);
    slideIn(welcomeSubtitleRef.current, 400);
    slideIn(welcomeSearchRef.current, 520);

    // 四个快捷入口卡片依次从左到右展开
    const cardRefs = [
      bookListCardRef.current,
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

  // 回车搜索 → 跳转到图书列表页并传递搜索词
  const handleSearch = () => {
    const term = search.trim();
    if (term) {
      navigate(`/books?q=${encodeURIComponent(term)}`);
    }
  };

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
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
        gap: "48px",
      }}
    >
      {/* ====== 欢迎卡片 ====== */}
      <div
        ref={welcomeCardRef}
        style={{
          position: "relative",
          zIndex: 1,
          width: "820px",
          clipPath: "inset(0 100% 0 0)",
          maxWidth: "94vw",
          padding: "64px 60px 56px",
          borderRadius: "20px",
          backgroundColor: "#e8f4fd",
          backdropFilter: "blur(16px)",
          boxShadow: "0 16px 56px rgba(0,0,0,0.22)",
          textAlign: "center",
        }}
      >
        {/* 图标 */}
        <div
          ref={welcomeIconRef}
          style={{
            fontSize: "56px",
            marginBottom: "20px",
            opacity: 0,
            transform: "translateX(-50px)",
          }}
        >
          📚
        </div>

        {/* 标题 */}
        <h1
          ref={welcomeTitleRef}
          style={{
            fontSize: "34px",
            fontWeight: 700,
            color: "#1a3a6b",
            margin: "0 0 10px",
            opacity: 0,
            transform: "translateX(-50px)",
          }}
        >
          欢迎使用图书管理系统
        </h1>
        <p
          ref={welcomeSubtitleRef}
          style={{
            fontSize: "16px",
            color: "#5a7fa0",
            margin: "0 0 36px",
            opacity: 0,
            transform: "translateX(-50px)",
          }}
        >
          轻松管理您的图书收藏，发现精彩阅读世界
        </p>

        {/* 搜索框 */}
        <div
          ref={welcomeSearchRef}
          style={{
            opacity: 0,
            transform: "translateX(-50px)",
          }}
        >
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              width: "100%",
              maxWidth: "600px",
              margin: "0 auto",
            }}
          >
            <span
              style={{
                position: "absolute",
                left: "18px",
                fontSize: "20px",
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
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#3498db";
                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(52,152,219,0.12)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#c8d8e8";
                e.currentTarget.style.boxShadow =
                  "0 2px 12px rgba(26,58,107,0.08)";
              }}
              style={{
                width: "100%",
                padding: "16px 52px 16px 52px",
                fontSize: "17px",
                color: "#1a3a6b",
                backgroundColor: "#fff",
                border: "2px solid #c8d8e8",
                borderRadius: "10px",
                outline: "none",
                boxShadow: "0 2px 12px rgba(26,58,107,0.08)",
                boxSizing: "border-box",
                transition: "border-color 0.2s, box-shadow 0.2s",
              }}
            />
            {/* 搜索按钮 */}
            {search.trim() && (
              <button
                onClick={handleSearch}
                style={{
                  position: "absolute",
                  right: "40px",
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  color: "#3498db",
                  cursor: "pointer",
                  padding: "4px",
                  lineHeight: 1,
                }}
                title="搜索"
              >
                →
              </button>
            )}
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{
                  position: "absolute",
                  right: "10px",
                  background: "none",
                  border: "none",
                  fontSize: "18px",
                  color: "#bbb",
                  cursor: "pointer",
                  padding: "4px",
                  lineHeight: 1,
                }}
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ====== 快捷入口卡片（浮动在背景之上） ====== */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: "20px",
          maxWidth: "940px",
          width: "100%",
        }}
      >
        {/* 图书列表卡片 */}
        <Link
          ref={bookListCardRef}
          to="/books"
          style={{
            textDecoration: "none",
            padding: "20px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(8px)",
            clipPath: "inset(0 100% 0 0)",
            transition: "box-shadow 0.2s, transform 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.2)";
            e.currentTarget.style.transform = "translateY(-3px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "";
            e.currentTarget.style.transform = "";
          }}
        >
          <div style={{ fontSize: "28px", marginBottom: "12px" }}>📖</div>
          <h2 style={{ margin: "0 0 8px", color: "#1a3a6b" }}>图书列表</h2>
          <p style={{ margin: 0, color: "#888", fontSize: "14px" }}>
            浏览全部馆藏图书，搜索您感兴趣的书籍
          </p>
        </Link>

        {/* 借阅记录卡片 */}
        <Link
          ref={borrowCardRef}
          to="/borrows"
          style={{
            textDecoration: "none",
            padding: "20px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(8px)",
            clipPath: "inset(0 100% 0 0)",
            transition: "box-shadow 0.2s, transform 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.2)";
            e.currentTarget.style.transform = "translateY(-3px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "";
            e.currentTarget.style.transform = "";
          }}
        >
          <div style={{ fontSize: "28px", marginBottom: "12px" }}>📋</div>
          <h2 style={{ margin: "0 0 8px", color: "#1a3a6b" }}>借阅记录</h2>
          <p style={{ margin: 0, color: "#888", fontSize: "14px" }}>
            查看当前借阅、历史借阅与归还记录
          </p>
        </Link>

        {/* 预约记录卡片 */}
        <Link
          ref={reserveCardRef}
          to="/reserves"
          style={{
            textDecoration: "none",
            padding: "20px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(8px)",
            clipPath: "inset(0 100% 0 0)",
            transition: "box-shadow 0.2s, transform 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.2)";
            e.currentTarget.style.transform = "translateY(-3px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "";
            e.currentTarget.style.transform = "";
          }}
        >
          <div style={{ fontSize: "28px", marginBottom: "12px" }}>📌</div>
          <h2 style={{ margin: "0 0 8px", color: "#1a3a6b" }}>预约记录</h2>
          <p style={{ margin: 0, color: "#888", fontSize: "14px" }}>
            管理图书预约、查看排队状态与取书期限
          </p>
        </Link>

        {/* 罚款记录卡片 */}
        <Link
          ref={fineCardRef}
          to="/fines"
          style={{
            textDecoration: "none",
            padding: "20px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(255,255,255,0.92)",
            backdropFilter: "blur(8px)",
            clipPath: "inset(0 100% 0 0)",
            transition: "box-shadow 0.2s, transform 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.2)";
            e.currentTarget.style.transform = "translateY(-3px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "";
            e.currentTarget.style.transform = "";
          }}
        >
          <div style={{ fontSize: "28px", marginBottom: "12px" }}>💰</div>
          <h2 style={{ margin: "0 0 8px", color: "#1a3a6b" }}>罚款记录</h2>
          <p style={{ margin: 0, color: "#888", fontSize: "14px" }}>
            查看罚款明细与待缴金额，及时处理缴费
          </p>
        </Link>
      </div>
    </div>
  );
}
