import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getBorrowList, returnBook } from "../../api/borrows";
import type { BorrowRecord } from "../../api/borrows";

export default function ReturnBookPage() {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [returningId, setReturningId] = useState<number | null>(null);
  const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // 加载所有借阅记录
  const fetchRecords = () => {
    setLoading(true);
    getBorrowList()
      .then((res) => {
        if (res.code === 200) {
          setRecords(res.data.items);
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  // 只展示未归还的记录（借阅中 + 逾期）
  const activeRecords = useMemo(
    () => records.filter((r) => r.status === "borrowed" || r.status === "overdue"),
    [records],
  );

  // 搜索过滤
  const filtered = useMemo(() => {
    if (!search.trim()) return activeRecords;
    const kw = search.toLowerCase();
    return activeRecords.filter(
      (r) =>
        r.reader_name.toLowerCase().includes(kw) ||
        r.book_title.toLowerCase().includes(kw) ||
        String(r.id).includes(kw),
    );
  }, [activeRecords, search]);

  // 执行还书
  const handleReturn = async (record: BorrowRecord) => {
    setReturningId(record.id);
    setMsg(null);
    try {
      const res = await returnBook(record.id);
      if (res.code === 200) {
        setMsg({ type: "success", text: `《${record.book_title}》归还成功！` });
        // 刷新列表
        fetchRecords();
      } else {
        setMsg({
          type: "error",
          text: res.message || res.msg || "归还失败，请重试",
        });
      }
    } catch {
      setMsg({ type: "error", text: "网络错误，请稍后重试" });
    } finally {
      setReturningId(null);
    }
  };

  function formatDate(dateStr: string): string {
    return dateStr.split("T")[0];
  }

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto", paddingBottom: "48px" }}>
      {/* 面包屑 */}
      <div style={{ marginBottom: "20px", fontSize: "13px", color: "#999" }}>
        <Link to="/home" style={{ color: "#999", textDecoration: "none" }}>
          首页
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "#333" }}>还书</span>
      </div>

      {/* 页面标题 */}
      <h2 style={{ fontSize: "22px", color: "#1a3a6b", margin: "0 0 20px" }}>
        📥 还书
      </h2>

      {/* 搜索栏 */}
      <div style={{ marginBottom: "16px", position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: "16px",
            top: "50%",
            transform: "translateY(-50%)",
            fontSize: "18px",
            color: "#a0b8d0",
            pointerEvents: "none",
          }}
        >
          🔍
        </span>
        <input
          type="text"
          placeholder="搜索读者姓名 / 书名 / 记录编号..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 16px 14px 48px",
            fontSize: "16px",
            color: "#333",
            backgroundColor: "#fff",
            border: "2px solid #c8d8e8",
            borderRadius: "10px",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* 操作反馈消息 */}
      {msg && (
        <div
          style={{
            marginBottom: "16px",
            padding: "10px 16px",
            borderRadius: "8px",
            fontSize: "14px",
            color: msg.type === "success" ? "#27ae60" : "#e94560",
            backgroundColor: msg.type === "success" ? "#f0faf4" : "#fff0f3",
            border: msg.type === "success" ? "1px solid #b7ebc8" : "1px solid #ffccc7",
          }}
        >
          {msg.text}
        </div>
      )}

      {/* 统计 */}
      <div style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
        当前在借 {activeRecords.length} 条记录
        {search.trim() && filtered.length !== activeRecords.length && (
          <span>，筛选后 {filtered.length} 条</span>
        )}
      </div>

      {/* 加载中 */}
      {loading && (
        <div style={{ textAlign: "center", padding: "60px 0", color: "#999" }}>
          ⏳ 加载中...
        </div>
      )}

      {/* 表格 */}
      {!loading && (
        <div
          style={{
            background: "#fff",
            borderRadius: "10px",
            border: "1px solid #e8e8e8",
            overflow: "hidden",
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  backgroundColor: "#fafafa",
                  borderBottom: "1px solid #e8e8e8",
                }}
              >
                {["记录编号", "读者", "图书名称", "借阅日期", "应还日期", "状态", "操作"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "13px 16px",
                        fontSize: "13px",
                        fontWeight: 600,
                        color: "#555",
                        textAlign: "left",
                      }}
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => {
                const isOverdue = record.status === "overdue";
                return (
                  <tr
                    key={record.id}
                    style={{ borderBottom: "1px solid #f0f0f0" }}
                  >
                    <td
                      style={{
                        padding: "13px 16px",
                        fontSize: "14px",
                        color: "#888",
                      }}
                    >
                      {record.id}
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: "14px" }}>
                      {record.reader_name}
                    </td>
                    <td style={{ padding: "13px 16px", fontSize: "14px" }}>
                      <Link
                        to={`/books/${record.book_id}`}
                        style={{ color: "#1a3a6b", textDecoration: "none" }}
                      >
                        {record.book_title}
                      </Link>
                    </td>
                    <td
                      style={{
                        padding: "13px 16px",
                        fontSize: "14px",
                        color: "#555",
                      }}
                    >
                      {formatDate(record.borrow_date)}
                    </td>
                    <td
                      style={{
                        padding: "13px 16px",
                        fontSize: "14px",
                        color: isOverdue ? "#e94560" : "#555",
                        fontWeight: isOverdue ? 600 : 400,
                      }}
                    >
                      {formatDate(record.due_date)}
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 10px",
                          borderRadius: "10px",
                          fontSize: "12px",
                          fontWeight: 500,
                          color: isOverdue ? "#e94560" : "#1890ff",
                          backgroundColor: isOverdue ? "#fff2f0" : "#e6f7ff",
                        }}
                      >
                        {isOverdue ? "逾期" : "借阅中"}
                      </span>
                    </td>
                    <td style={{ padding: "13px 16px" }}>
                      <button
                        onClick={() => handleReturn(record)}
                        disabled={returningId === record.id}
                        style={{
                          padding: "6px 16px",
                          fontSize: "13px",
                          fontWeight: 500,
                          color: returningId === record.id ? "#ccc" : "#fff",
                          backgroundColor:
                            returningId === record.id ? "#f0f0f0" : "#27ae60",
                          border: "none",
                          borderRadius: "6px",
                          cursor:
                            returningId === record.id ? "not-allowed" : "pointer",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          if (returningId !== record.id) {
                            e.currentTarget.style.backgroundColor = "#219a52";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (returningId !== record.id) {
                            e.currentTarget.style.backgroundColor = "#27ae60";
                          }
                        }}
                      >
                        {returningId === record.id ? "归还中..." : "📥 还书"}
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && !loading && (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: "48px 0",
                      textAlign: "center",
                      color: "#ccc",
                      fontSize: "14px",
                    }}
                  >
                    {search.trim() ? "未找到匹配的借阅记录" : "🎉 当前没有在借记录"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
