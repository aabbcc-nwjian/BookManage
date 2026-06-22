import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBorrowList } from "../../api/record";
import type { BorrowRecord } from "../../api/record";
import { getBookList } from "../../api";
import useBookStore from "../../store/books";

const STATUS_MAP: Record<string, { color: string; bg: string; text: string }> =
  {
    borrowed: { color: "#1890ff", bg: "#e6f7ff", text: "借阅中" },
    returned: { color: "#52c41a", bg: "#f6ffed", text: "已归还" },
    overdue: { color: "#ff4d4f", bg: "#fff2f0", text: "逾期" },
  };

export default function BorrowRecordsPage() {
  const [filter, setFilter] = useState("全部");
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const readername = localStorage.getItem("username");
  useEffect(() => {
    getBookList().then((res) => {
      useBookStore.setState({ books: res.data.items });
    });
    getBorrowList().then((res) => {
      console.log("借阅记录:", res.data.items);
      setRecords(res.data.items.filter((r) => r.reader_name === readername));
    });
  }, []);

  function formatDate(dateStr: string): string {
    return dateStr.split("T")[0];
  }

  const filtered =
    filter === "全部" ? records : records.filter((r) => r.status === filter);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      {/* 面包屑 */}
      <div style={{ marginBottom: "20px", fontSize: "13px", color: "#999" }}>
        <Link to="/home" style={{ color: "#999", textDecoration: "none" }}>
          首页
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "#333" }}>借阅记录</span>
      </div>

      <h2 style={{ fontSize: "22px", color: "#1a3a6b", margin: "0 0 20px" }}>
        📋 借阅记录
      </h2>

      {/* 筛选标签 */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {[
          ["全部", "全部"],
          ["借阅中", "borrowed"],
          ["已归还", "returned"],
          ["逾期", "overdue"],
        ].map((s) => (
          <button
            key={s[1]}
            onClick={() => setFilter(s[1])}
            style={{
              padding: "6px 18px",
              fontSize: "13px",
              borderRadius: "16px",
              border:
                filter === s[1] ? "1px solid #e94560" : "1px solid #e0e0e0",
              color: filter === s[1] ? "#e94560" : "#666",
              backgroundColor: filter === s[1] ? "#fff0f3" : "#fff",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {s[0]}
          </button>
        ))}
      </div>

      {/* 表格 */}
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
              {[
                "记录编号",
                "图书名称",
                "借阅日期",
                "应还日期",
                "归还日期",
                "状态",
              ].map((h) => (
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
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((record) => {
              const s = STATUS_MAP[record.status];
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
                      color: "#555",
                    }}
                  >
                    {formatDate(record.due_date)}
                  </td>
                  <td
                    style={{
                      padding: "13px 16px",
                      fontSize: "14px",
                      color: "#555",
                    }}
                  >
                    {record.return_date ?? "-"}
                  </td>
                  <td style={{ padding: "13px 16px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        padding: "2px 10px",
                        borderRadius: "10px",
                        fontSize: "12px",
                        fontWeight: 500,
                        color: s.color,
                        backgroundColor: s.bg,
                      }}
                    >
                      {s.text}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td
                  colSpan={6}
                  style={{
                    padding: "48px 0",
                    textAlign: "center",
                    color: "#ccc",
                    fontSize: "14px",
                  }}
                >
                  暂无记录
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
