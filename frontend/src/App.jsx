import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import "./App.css";

import ProductListPage from "./pages/ProductListPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductEditPage from "./pages/ProductEditPage";
import WishlistPage from "./pages/WishlistPage";
import LoginPage from "./pages/LoginPage";
import SentTradePage from "./pages/SentTradePage";
import ReceivedTradePage from "./pages/ReceivedTradePage";
import SignupPage from "./pages/SignupPage";
import MyPage from "./pages/MyPage";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ProtectedRoute({ loginUser, children}) {
  
  if (!loginUser) {
    
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const [loginUser, setLoginUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const fetchLoginUser = async() => {
    
    try {
      const response = await axios.get(`${BASE_URL}/api/auth/me`, {
        withCredentials : true,
      });

      setLoginUser(response.data);

    } catch (error) {
      console.log("로그인 안된 상태");
      setLoginUser(null);

    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    fetchLoginUser();
  }, []);

  const handleLoginSuccess = (user) => {
    setLoginUser(user);
  };

  const handleLogout = async () => {

    try {
      await axios.post(
        `${BASE_URL}/api/auth/logout`,
        {},
        {
          withCredentials : true,
        }
      );

      setLoginUser(null);
      alert("로그아웃 되었습니다.");

    } catch (error) {
      console.log("로그아웃 실패", error);

      if (error.response) {
        alert("로그아웃 처리 중 서버 오류가 발생했습니다.");

      } else if (error.request) {
        alert("서버 응답이 없습니다.");

      } else {
        alert("로그아웃 요청 오류가 발생했습니다.");
      }
    }
  };

  if (authLoading) {

    return <div>로그인 상태 확인 중...</div>;
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="navbar">
          <Link to="/">상품 목록</Link>

          {loginUser ? (
            <>
              <span className="navbar-user">
                {loginUser.name}님 로그인 중
              </span>

              <Link to="/mypage">마이페이지</Link>
              <Link to="/wishlist">내 찜 목록</Link>
              <Link to="/trades/sent">보낸 거래 요청</Link>
              <Link to="/trades/received">받은 거래 요청</Link>

              <button
                type="button"
                className="secondary"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <span className="navbar-user">
                로그인되지 않았습니다.
              </span>

              <Link to="/login">
                <button type="button">로그인</button>
              </Link>

              <Link to="/signup">
                <button type="button" className="secondary">
                  회원가입
                </button>
              </Link>
            </>
          )}
        </nav>

        <Routes>
          <Route
            path="/"
            element={<ProductListPage loginUser={loginUser} />}
          />

          <Route
            path="/products/:id"
            element={<ProductDetailPage loginUser={loginUser} />}
          />

          <Route
            path="/products/edit/:id"
            element={<ProductEditPage loginUser={loginUser} />}
          />

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute loginUser={loginUser}>
                <WishlistPage loginUser={loginUser} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/mypage"
            element={
              <ProtectedRoute loginUser={loginUser}>
                <MyPage
                  loginUser={loginUser}
                  setLoginUser={setLoginUser}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/login"
            element={
              loginUser ? (
                <Navigate to="/" replace />
              ) : (
                <LoginPage onLoginSuccess={handleLoginSuccess} />
              )
            }
          />

          <Route
            path="/trades/sent"
            element={
              <ProtectedRoute loginUser={loginUser}>
                <SentTradePage loginUser={loginUser} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/trades/received"
            element={
              <ProtectedRoute loginUser={loginUser}>
                <ReceivedTradePage loginUser={loginUser} />
              </ProtectedRoute>
            }
          />

          <Route
            path="/signup"
            element={<SignupPage />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;