import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { getAllBooks } from "../../data/books";
import type { Book } from "../../data/books";
import { addBook } from "../../api/books";

const books = getAllBooks();
const allCategories = [...new Set(books.map((b) => b.category))];

export default function AdminPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("全部");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

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
  }, [search, category]);

  return (
    <div style={{ maxWidth: "960px", margin: "0 auto", paddingBottom: "48px" }}>
      {/* 面包屑 */}
      <div style={{ marginBottom: "20px", fontSize: "13px", color: "#999" }}>
        <Link to="/home" style={{ color: "#999", textDecoration: "none" }}>
          首页
        </Link>
        <span style={{ margin: "0 8px" }}>/</span>
        <span style={{ color: "#333" }}>管理员页面</span>
      </div>

      {/* 页面标题 */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ fontSize: "22px", color: "#1a3a6b", margin: 0 }}>
          ⚙️ 管理员页面
        </h2>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            setEditingId(null);
          }}
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            fontWeight: 600,
            color: "#fff",
            backgroundColor: showAddForm ? "#999" : "#27ae60",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {showAddForm ? "取消" : "+ 添加图书"}
        </button>
      </div>

      {/* 添加 / 编辑图书表单 */}
      {(showAddForm || editingId !== null) && (
        <AdminBookForm
          book={editingId ? books.find((b) => b.id === editingId) : undefined}
          allCategories={allCategories}
          onClose={() => {
            setShowAddForm(false);
            setEditingId(null);
          }}
        />
      )}

      {/* 搜索栏 + 筛选 */}
      <div
        style={{
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
          marginBottom: "20px",
        }}
      >
        <div style={{ flex: "1 1 320px", position: "relative" }}>
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
            placeholder="搜索书名 / 作者 / ISBN..."
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
          {allCategories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {/* 结果统计 */}
      <div style={{ fontSize: "13px", color: "#888", marginBottom: "16px" }}>
        共 {filtered.length} 本图书
      </div>

      {/* 图书管理列表 */}
      {filtered.length > 0 ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.map((book: Book) => (
            <BookManageRow
              key={book.id}
              book={book}
              isEditing={editingId === book.id}
              onEdit={() => {
                setEditingId(editingId === book.id ? null : book.id);
                setShowAddForm(false);
              }}
              onDelete={() => {
                // TODO: 实现删除功能
                alert(`删除图书: ${book.title}（功能待实现）`);
              }}
            />
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
  );
}

/** 单本图书管理行 */
function BookManageRow({
  book,
  isEditing,
  onEdit,
  onDelete,
}: {
  book: Book;
  isEditing: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        background: "#fff",
        borderRadius: "10px",
        border: isEditing ? "2px solid #3498db" : "1px solid #d0dff0",
        padding: "14px 20px",
      }}
    >
      {/* 图书信息 */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: "15px", fontWeight: 600, color: "#1a3a6b" }}>
          {book.title}
        </div>
        <div style={{ fontSize: "13px", color: "#888", marginTop: "2px" }}>
          {book.author} · {book.year} · {book.category} · ISBN{" "}
          {book.isbn.slice(-7)}
        </div>
      </div>

      {/* 剩余数量 */}
      <span
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: book.remaining > 0 ? "#1a3a6b" : "#e94560",
          flexShrink: 0,
          minWidth: "60px",
          textAlign: "center",
        }}
      >
        剩余 {book.remaining}
      </span>

      {/* 状态标签 */}
      <span
        style={{
          fontSize: "12px",
          padding: "3px 10px",
          borderRadius: "8px",
          backgroundColor: book.status === "可借" ? "#e8f8ef" : "#fdecea",
          color: book.status === "可借" ? "#27ae60" : "#e94560",
          flexShrink: 0,
        }}
      >
        {book.status}
      </span>

      {/* 操作按钮 */}
      <div style={{ display: "flex", gap: "8px", flexShrink: 0 }}>
        <button onClick={onEdit} style={actionBtnStyle}>
          {isEditing ? "取消编辑" : "✏️ 编辑"}
        </button>
        <button
          onClick={onDelete}
          style={{ ...actionBtnStyle, color: "#e94560" }}
        >
          🗑️ 删除
        </button>
      </div>
    </div>
  );
}

/** 添加 / 编辑图书表单（占位） */
function AdminBookForm({
  book,
  allCategories,
  onClose,
}: {
  book?: Book;
  allCategories: string[];
  onClose: () => void;
}) {
  const isEdit = !!book;

  return (
    <div
      style={{
        background: "#fff",
        borderRadius: "10px",
        border: "2px solid #3498db",
        padding: "24px",
        marginBottom: "20px",
      }}
    >
      <h3 style={{ color: "#1a3a6b", margin: "0 0 20px" }}>
        {isEdit ? `✏️ 编辑图书：${book.title}` : "➕ 添加新图书"}
      </h3>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "16px",
          marginBottom: "20px",
        }}
      >
        <FormField label="书名" placeholder="请输入书名" />
        <FormField label="作者" placeholder="请输入作者" />
        <FormField label="ISBN" placeholder="请输入 ISBN" />
        <div>
          <label style={labelStyle}>分类</label>
          <select style={{ ...inputStyle, cursor: "pointer" }}>
            <option value="">请选择分类</option>
            {allCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <FormField label="出版年份" placeholder="请输入出版年份" />
        <FormField label="页数" placeholder="请输入页数" />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>内容简介</label>
        <textarea
          placeholder="请输入内容简介"
          rows={3}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          style={{
            padding: "10px 28px",
            fontSize: "14px",
            fontWeight: 600,
            color: "#fff",
            backgroundColor: "#3498db",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          {isEdit ? "保存修改" : "确认添加"}
        </button>
        <button onClick={onClose} style={cancelBtnStyle}>
          取消
        </button>
      </div>
    </div>
  );
}

/** 表单字段 */
function FormField({
  label,
  placeholder,
}: {
  label: string;
  placeholder: string;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input type="text" placeholder={placeholder} style={inputStyle} />
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  fontWeight: 600,
  color: "#555",
  marginBottom: "6px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 14px",
  fontSize: "14px",
  color: "#333",
  backgroundColor: "#f8fafc",
  border: "1px solid #d0dff0",
  borderRadius: "6px",
  outline: "none",
  boxSizing: "border-box",
};

const actionBtnStyle: React.CSSProperties = {
  padding: "6px 14px",
  fontSize: "13px",
  color: "#3498db",
  backgroundColor: "#f0f6fc",
  border: "1px solid #d0dff0",
  borderRadius: "6px",
  cursor: "pointer",
};

const cancelBtnStyle: React.CSSProperties = {
  padding: "10px 24px",
  fontSize: "14px",
  color: "#333",
  backgroundColor: "#fff",
  border: "1px solid #d9d9d9",
  borderRadius: "6px",
  cursor: "pointer",
};
