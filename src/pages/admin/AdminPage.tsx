import { useState, useMemo, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { addBook, getBookList, removeBook, updateBook } from "../../api/books";
import type { AddBookParams, Book, UpdateBookParams } from "../../api/books";
import useBookStore from "../../store/books";

//const books = getAllBooks();
//const allCategories = [...new Set(books.map((b) => b.category))];

export default function AdminPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("全部");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const books = useBookStore((state) => state.books);
  const allCategories = useBookStore((state) => state.allCategories);
  const setBooks = useBookStore((state) => state.setBooks);

  const refreshBooks = useCallback(() => {
    getBookList().then((res) => {
      const nextBooks = res.data.items;
      setBooks(nextBooks);
      console.log(res, nextBooks);
    });
  }, [setBooks]);

  useEffect(() => {
    refreshBooks();
  }, [refreshBooks]);

  const handleDeleteBook = async (book: Book) => {
    const confirmed = window.confirm(`确定要删除《${book.title}》吗？`);
    if (!confirmed) return;

    try {
      const res = await removeBook(book.id);
      if (res.code === 200) {
        await refreshBooks();
        alert("删除成功");
      } else {
        alert(res.message || "删除失败");
      }
    } catch {
      alert("删除失败，请稍后重试");
    }
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
  }, [search, category, books]);

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
        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={() => navigate("/return")}
            style={{
              padding: "10px 20px",
              fontSize: "14px",
              fontWeight: 600,
              color: "#fff",
              backgroundColor: "#27ae60",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            📥 还书
          </button>
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
          onSaved={async () => {
            await refreshBooks();
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
              onDelete={() => handleDeleteBook(book)}
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
          {book.author} · {book.published_date} · {book.category} · ISBN{" "}
          {book.isbn.slice(-7)}
        </div>
      </div>

      {/* 剩余数量 */}
      <span
        style={{
          fontSize: "13px",
          fontWeight: 600,
          color: book.available_quantity > 0 ? "#1a3a6b" : "#e94560",
          flexShrink: 0,
          minWidth: "60px",
          textAlign: "center",
        }}
      >
        剩余 {book.available_quantity}
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
  onSaved,
}: {
  book?: Book;
  allCategories: string[];
  onClose: () => void;
  onSaved: () => void | Promise<void>;
}) {
  const isEdit = !!book;
  const [title, setTitle] = useState(book?.title || "");
  const [author, setAuthor] = useState(book?.author || "");
  const [isbn, setIsbn] = useState(book?.isbn || "");
  const [publisher, setPublisher] = useState(book?.publisher || "");
  const [category, setCategory] = useState(book?.category || "");
  const [publishedDate, setPublishedDate] = useState(
    book?.published_date || "",
  );
  const [pages, setPages] = useState(book?.pages ? String(book.pages) : "");
  const [quantity, setQuantity] = useState(
    book ? String(book.total_quantity) : "",
  );
  const [shelfLocation, setShelfLocation] = useState(
    book?.shelf_location || "",
  );
  const [description, setDescription] = useState(book?.description || "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (
      !title.trim() ||
      !author.trim() ||
      !publisher.trim() ||
      !category.trim() ||
      !publishedDate.trim() ||
      !quantity.trim() ||
      !shelfLocation.trim() ||
      (!isEdit && !isbn.trim())
    ) {
      alert("请填写完整的图书信息");
      return;
    }

    const numericQuantity = Number(quantity);
    const numericPages = pages.trim() ? Number(pages) : undefined;

    if (!Number.isFinite(numericQuantity) || numericQuantity < 0) {
      alert("库存数量必须是大于等于 0 的数字");
      return;
    }

    if (
      numericPages !== undefined &&
      (!Number.isFinite(numericPages) || numericPages < 0)
    ) {
      alert("页数必须是大于等于 0 的数字");
      return;
    }

    setSubmitting(true);
    try {
      if (isEdit) {
        const data: UpdateBookParams = {
          title: title.trim(),
          author: author.trim(),
          publisher: publisher.trim(),
          category: category.trim(),
          published_date: publishedDate.trim(),
          total_quantity: numericQuantity,
          shelf_location: shelfLocation.trim(),
          description: description.trim(),
        };

        if (numericPages !== undefined) {
          data.pages = numericPages;
        }

        const res = await updateBook(book.id, data);
        if (res.code !== 200) {
          alert(res.message || "修改失败");
          return;
        }
      } else {
        const data: AddBookParams = {
          isbn: isbn.trim(),
          title: title.trim(),
          author: author.trim(),
          publisher: publisher.trim(),
          category: category.trim(),
          published_date: publishedDate.trim(),
          quantity: numericQuantity,
          shelf_location: shelfLocation.trim(),
          description: description.trim(),
          pages: numericPages,
        };

        const res = await addBook(data);
        if (res.code !== 201 && res.code !== 200) {
          alert(res.message || "添加失败");
          return;
        }
      }

      await onSaved();
      alert(isEdit ? "修改成功" : "添加成功");
    } catch {
      alert(isEdit ? "修改失败，请稍后重试" : "添加失败，请稍后重试");
    } finally {
      setSubmitting(false);
    }
  };

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
        <FormField
          label="书名"
          placeholder="请输入书名"
          value={title}
          onChange={setTitle}
        />
        <FormField
          label="作者"
          placeholder="请输入作者"
          value={author}
          onChange={setAuthor}
        />
        <FormField
          label="ISBN"
          placeholder="请输入 ISBN"
          value={isbn}
          onChange={setIsbn}
          disabled={isEdit}
        />
        <FormField
          label="出版社"
          placeholder="请输入出版社"
          value={publisher}
          onChange={setPublisher}
        />
        <div>
          <label style={labelStyle}>分类</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ ...inputStyle, cursor: "pointer" }}
          >
            <option value="">请选择分类</option>
            {allCategories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <FormField
          label="出版日期"
          placeholder="例如：2024-01-01"
          value={publishedDate}
          onChange={setPublishedDate}
        />
        <FormField
          label={isEdit ? "总库存" : "新增数量"}
          placeholder="请输入库存数量"
          value={quantity}
          onChange={setQuantity}
          type="number"
        />
        <FormField
          label="书架位置"
          placeholder="例如：A3-12"
          value={shelfLocation}
          onChange={setShelfLocation}
        />
        <FormField
          label="页数"
          placeholder="请输入页数"
          value={pages}
          onChange={setPages}
          type="number"
        />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <label style={labelStyle}>内容简介</label>
        <textarea
          placeholder="请输入内容简介"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      <div style={{ display: "flex", gap: "12px" }}>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          style={{
            padding: "10px 28px",
            fontSize: "14px",
            fontWeight: 600,
            color: "#fff",
            backgroundColor: submitting ? "#8bbfe3" : "#3498db",
            border: "none",
            borderRadius: "6px",
            cursor: submitting ? "not-allowed" : "pointer",
          }}
        >
          {submitting ? "提交中..." : isEdit ? "保存修改" : "确认添加"}
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
  value,
  onChange,
  type = "text",
  disabled = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        style={{
          ...inputStyle,
          cursor: disabled ? "not-allowed" : "text",
          opacity: disabled ? 0.65 : 1,
        }}
      />
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
