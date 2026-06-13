import { useState } from "react";
import { Link } from "react-router-dom";

// 模拟借阅数据
const MOCK_RECORDS = [
  {
    id: "BR001",
    bookTitle: "三体",
    bookId: "1",
    borrowDate: "2026-05-20",
    dueDate: "2026-06-20",
    returnDate: null,
    status: "借阅中",
  },
  {
    id: "BR002",
    bookTitle: "活着",
    bookId: "2",
    borrowDate: "2026-05-15",
    dueDate: "2026-06-15",
    returnDate: "2026-06-10",
    status: "已归还",
  },
  {
    id: "BR003",
    bookTitle: "JavaScript高级程序设计",
    bookId: "3",
    borrowDate: "2026-05-10",
    dueDate: "2026-06-10",
    returnDate: "2026-06-08",
    status: "已归还",
  },
  {
    id: "BR004",
    bookTitle: "设计模式",
    bookId: "5",
    borrowDate: "2026-06-01",
    dueDate: "2026-07-01",
    returnDate: null,
    status: "借阅中",
  },
  {
    id: "BR005",
    bookTitle: "百年孤独",
    bookId: "6",
    borrowDate: "2026-04-25",
    dueDate: "2026-05-25",
    returnDate: null,
    status: "逾期",
  },
];

const STATUS_MAP: Record<string, { color: string; bg: string }> = {
  借阅中: { color: "#1890ff", bg: "#e6f7ff" },
  已归还: { color: "#52c41a", bg: "#f6ffed" },
  逾期: { color: "#ff4d4f", bg: "#fff2f0" },
};

export default function BorrowRecordsPage() {
  const [filter, setFilter] = useState("全部");

  const filtered =
    filter === "全部"
      ? MOCK_RECORDS
      : MOCK_RECORDS.filter((r) => r.status === filter);

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
        {["全部", "借阅中", "已归还", "逾期"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            style={{
              padding: "6px 18px",
              fontSize: "13px",
              borderRadius: "16px",
              border:
                filter === s ? "1px solid #e94560" : "1px solid #e0e0e0",
              color: filter === s ? "#e94560" : "#666",
              backgroundColor: filter === s ? "#fff0f3" : "#fff",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            {s}
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
              {["记录编号", "图书名称", "借阅日期", "应还日期", "归还日期", "状态"].map(
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
                )
              )}
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
                  <td style={{ padding: "13px 16px", fontSize: "14px", color: "#888" }}>
                    {record.id}
                  </td>
                  <td style={{ padding: "13px 16px", fontSize: "14px" }}>
                    <Link
                      to={`/books/${record.bookId}`}
                      style={{ color: "#1a3a6b", textDecoration: "none" }}
                    >
                      {record.bookTitle}
                    </Link>
                  </td>
                  <td style={{ padding: "13px 16px", fontSize: "14px", color: "#555" }}>
                    {record.borrowDate}
                  </td>
                  <td style={{ padding: "13px 16px", fontSize: "14px", color: "#555" }}>
                    {record.dueDate}
                  </td>
                  <td style={{ padding: "13px 16px", fontSize: "14px", color: "#555" }}>
                    {record.returnDate ?? "-"}
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
                      {record.status}
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
