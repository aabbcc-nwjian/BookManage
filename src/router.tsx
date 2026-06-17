import { lazy, Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";
import type { RouteObject } from "react-router-dom";
import Layout from "./components/Layout";

// 懒加载页面组件
const Home = lazy(() => import("./pages/home/HomePage"));
const Login = lazy(() => import("./pages/login/LoginPage"));
const BookList = lazy(() => import("./pages/bookList/BookListPage"));
const BookDetail = lazy(() => import("./pages/bookDetail/BookDetailPage"));
const BorrowRecords = lazy(() => import("./pages/borrowRecords/BorrowRecordsPage"));
const ReserveRecords = lazy(() => import("./pages/reserveRecords/ReserveRecordsPage"));
const FineRecords = lazy(() => import("./pages/fineRecords/FineRecordsPage"));
const Borrow = lazy(() => import("./pages/borrow/BorrowPage"));
const Reserve = lazy(() => import("./pages/reserve/ReservePage"));
const Admin = lazy(() => import("./pages/admin/AdminPage"));
const ReturnBook = lazy(() => import("./pages/returnBook/ReturnBookPage"));
const My = lazy(() => import("./pages/my/MyPage"));

const routeConfig: RouteObject[] = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },
      { path: "home", element: <Home /> },
      { path: "books", element: <BookList /> },
      { path: "books/:id", element: <BookDetail /> },
      { path: "books/:id/borrow", element: <Borrow /> },
      { path: "books/:id/reserve", element: <Reserve /> },
      { path: "borrows", element: <BorrowRecords /> },
      { path: "reserves", element: <ReserveRecords /> },
      { path: "fines", element: <FineRecords /> },
      { path: "admin", element: <Admin /> },
      { path: "return", element: <ReturnBook /> },
      { path: "my", element: <My /> },
    ],
  },
];

const AppRoutes = () => {
  const routes = useRoutes(routeConfig);
  return <Suspense fallback={<div>加载中...</div>}>{routes}</Suspense>;
};

export default AppRoutes;