import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getReservationList } from "../../api/record";
import type { ReservationRecord } from "../../api/record";

const STATUS_MAP: Record<string, { color: string; bg: string; text: string }> =
  {
    waiting: { color: "#faad14", bg: "#fffbe6", text: "待取书" },
    notified: { color: "#1890ff", bg: "#e6f7ff", text: "已通知" },
    fulfilled: { color: "#52c41a", bg: "#f6ffed", text: "已取书" },
    expired: { color: "#999", bg: "#f5f5f5", text: "已过期" },
    cancelled: { color: "#ff4d4f", bg: "#fff2f0", text: "已取消" },
  };

export default function ReserveRecordsPage() {
  const [filter, setFilter] = useState("全部");
  const [records, setRecords] = useState<ReservationRecord[]>([]);

  useEffect(() => {
    getReservationList().then((res) => {
      console.log("预约记录:", res.data.items);
      setRecords(res.data.items);
    });
  }, []);

  // 计算截止日期（预约日期+1年）
  function calculateExpiryDate(dateStr: string): string {
    const date = new Date(dateStr);
    date.setFullYear(date.getFullYear() + 1);
    // 格式化输出为 YYYY-MM-DD
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  // 格式化日期（去掉时间部分）
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
              border: filter === s ? "1px solid #e94560" : "1px solid #e0e0e0",
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
              {[
                "预约编号",
                "图书名称",
                "预约日期",
                "截止日期",
                "排队序号",
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
                    {formatDate(record.reservation_date)}
                  </td>
                  <td
                    style={{
                      padding: "13px 16px",
                      fontSize: "14px",
                      color: "#555",
                    }}
                  >
                    {calculateExpiryDate(record.reservation_date)}
                  </td>
                  <td
                    style={{
                      padding: "13px 16px",
                      fontSize: "14px",
                      color: "#555",
                    }}
                  >
                    第 {record.queue_number} 位
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
