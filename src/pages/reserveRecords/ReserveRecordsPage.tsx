import { useState } from "react";
import { Link } from "react-router-dom";

// 模拟预约数据
const MOCK_RESERVES = [
  {
    id: "RS001",
    bookTitle: "红楼梦",
    bookId: "4",
    reserveDate: "2026-06-08",
    expireDate: "2026-06-15",
    queuePosition: 1,
    status: "待取书",
  },
  {
    id: "RS002",
    bookTitle: "三体",
    bookId: "1",
    reserveDate: "2026-06-05",
    expireDate: "2026-06-12",
    queuePosition: 2,
    status: "预约中",
  },
  {
    id: "RS003",
    bookTitle: "JavaScript高级程序设计",
    bookId: "3",
    reserveDate: "2026-05-28",
    expireDate: "2026-06-04",
    queuePosition: 1,
    status: "已取书",
  },
  {
    id: "RS004",
    bookTitle: "设计模式",
    bookId: "5",
    reserveDate: "2026-06-01",
    expireDate: "2026-06-08",
    queuePosition: 3,
    status: "已取消",
  },
];

const STATUS_MAP: Record<string, { color: string; bg: string }> = {
  待取书: { color: "#faad14", bg: "#fffbe6" },
  预约中: { color: "#1890ff", bg: "#e6f7ff" },
  已取书: { color: "#52c41a", bg: "#f6ffed" },
  已取消: { color: "#999", bg: "#f5f5f5" },
};

export default function ReserveRecordsPage() {
  const [filter, setFilter] = useState("全部");

  const filtered =
    filter === "全部"
      ? MOCK_RESERVES
      : MOCK_RESERVES.filter((r) => r.status === filter);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      {/* 面包屑 */}
      <div style={{ marginBottom: "20px", fontSize: "13px", color: "#999" }}>
        <Link to="/home" style={{ color: "#999", textDecoration: "none" }}>
          首页
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "#333" }}>预约记录</span>
      </div>

      <h2 style={{ fontSize: "22px", color: "#1a3a6b", margin: "0 0 20px" }}>
        📌 预约记录
      </h2>

      {/* 筛选标签 */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {["全部", "待取书", "预约中", "已取书", "已取消"].map((s) => (
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
              {["预约编号", "图书名称", "预约日期", "截止日期", "排队序号", "状态"].map(
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
                    {record.reserveDate}
                  </td>
                  <td style={{ padding: "13px 16px", fontSize: "14px", color: "#555" }}>
                    {record.expireDate}
                  </td>
                  <td style={{ padding: "13px 16px", fontSize: "14px", color: "#555" }}>
                    第 {record.queuePosition} 位
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
