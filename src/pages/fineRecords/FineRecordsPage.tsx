import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getFineList, getBookList, payFine } from "../../api";
import type { FineRecord } from "../../api";
import { getApiBookById } from "../../data/books";
import useBookStore from "../../store/books";

const STATUS_MAP: Record<string, { color: string; bg: string; text: string }> =
  {
    unpaid: { color: "#ff4d4f", bg: "#fff2f0", text: "未缴纳" },
    paid: { color: "#52c41a", bg: "#f6ffed", text: "已缴纳" },
  };

export default function FineRecordsPage() {
  const [filter, setFilter] = useState("全部");
  const [records, setRecords] = useState<FineRecord[]>([]);
  const [payingIds, setPayingIds] = useState<Set<number>>(new Set());
  const [payingAll, setPayingAll] = useState(false);

  const fetchRecords = () => {
    getFineList().then((res) => {
      console.log("罚款记录:", res.data.items);
      setRecords(res.data.items);
    });
    getBookList().then((res) => {
      useBookStore.setState({ books: res.data.items });
      console.log("图书列表:", res.data.items);
    });
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  /** 缴纳单笔罚款 */
  const handlePayOne = async (fineId: number) => {
    setPayingIds((prev) => new Set(prev).add(fineId));
    try {
      await payFine(fineId);
      fetchRecords();
    } finally {
      setPayingIds((prev) => {
        const next = new Set(prev);
        next.delete(fineId);
        return next;
      });
    }
  };

  /** 一键缴纳所有未缴罚款 */
  const handlePayAll = async () => {
    const unpaidIds = records
      .filter((r) => r.status === "unpaid")
      .map((r) => r.id);
    if (unpaidIds.length === 0) return;
    setPayingAll(true);
    try {
      await Promise.all(unpaidIds.map((id) => payFine(id)));
      fetchRecords();
    } finally {
      setPayingAll(false);
    }
  };

  const filtered =
    filter === "全部" ? records : records.filter((r) => r.status === filter);

  const unpaidRecords = records.filter((f) => f.status === "unpaid");
  const unpaidCount = unpaidRecords.length;
  const totalUnpaid = unpaidRecords.reduce((sum, f) => sum + f.amount, 0);

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      {/* 面包屑 */}
      <div style={{ marginBottom: "20px", fontSize: "13px", color: "#999" }}>
        <Link to="/home" style={{ color: "#999", textDecoration: "none" }}>
          首页
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "#333" }}>罚款记录</span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontSize: "22px", color: "#1a3a6b", margin: 0 }}>
          💰 罚款记录
        </h2>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* 待缴总额 */}
          <div
            style={{
              padding: "8px 20px",
              borderRadius: "8px",
              backgroundColor: "#fff2f0",
              border: "1px solid #ffccc7",
              fontSize: "14px",
              color: "#ff4d4f",
              fontWeight: 600,
            }}
          >
            待缴总额：¥{totalUnpaid.toFixed(2)}
          </div>

          {/* 一键缴纳 */}
          {unpaidCount > 0 && (
            <button
              onClick={handlePayAll}
              disabled={payingAll}
              style={{
                padding: "8px 20px",
                borderRadius: "8px",
                border: "1px solid #e94560",
                backgroundColor: "#e94560",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 600,
                cursor: payingAll ? "not-allowed" : "pointer",
                opacity: payingAll ? 0.6 : 1,
                whiteSpace: "nowrap",
              }}
            >
              {payingAll ? "缴纳中…" : `一键缴纳（${unpaidCount}笔）`}
            </button>
          )}
        </div>
      </div>

      {/* 筛选标签 */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {["全部", "未缴纳", "已缴纳"].map((s) => (
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
                "罚款编号",
                "图书名称",
                "金额",
                "原因",
                "日期",
                "状态",
                "操作",
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
                    FN{record.id}
                  </td>
                  <td style={{ padding: "13px 16px", fontSize: "14px" }}>
                    <Link
                      to={`/books/${record.borrow_id}`}
                      style={{ color: "#1a3a6b", textDecoration: "none" }}
                    >
                      {getApiBookById(record.borrow_id)?.title ?? "-"}
                    </Link>
                  </td>
                  <td
                    style={{
                      padding: "13px 16px",
                      fontSize: "14px",
                      color: "#ff4d4f",
                      fontWeight: 600,
                    }}
                  >
                    ¥{record.amount.toFixed(2)}
                  </td>
                  <td
                    style={{
                      padding: "13px 16px",
                      fontSize: "14px",
                      color: "#555",
                    }}
                  >
                    {record.reason}
                  </td>
                  <td
                    style={{
                      padding: "13px 16px",
                      fontSize: "14px",
                      color: "#555",
                    }}
                  >
                    {record.created_date}
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
                  <td style={{ padding: "13px 16px" }}>
                    {record.status === "unpaid" && (
                      <button
                        onClick={() => handlePayOne(record.id)}
                        disabled={payingIds.has(record.id)}
                        style={{
                          padding: "4px 14px",
                          borderRadius: "6px",
                          border: "1px solid #e94560",
                          backgroundColor: "#fff",
                          color: "#e94560",
                          fontSize: "13px",
                          fontWeight: 500,
                          cursor: payingIds.has(record.id)
                            ? "not-allowed"
                            : "pointer",
                          opacity: payingIds.has(record.id) ? 0.6 : 1,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {payingIds.has(record.id) ? "缴纳中…" : "去缴纳"}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
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
