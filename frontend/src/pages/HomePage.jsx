import { Link } from "react-router-dom";
import "./HomePage.css";

function HomePage({ loginUser }) {

    return (
        <div className="home-page">
            <nav className="home-navbar">
                <Link to="/" className="home-logo">
                    TradeHub
                </Link>

                <div className="home-menu">
                    <Link to="/products">상품 목록</Link>
                    <Link to="/products/new">상품 등록</Link>
                    <Link to="/wishlist">찜 목록</Link>
                    <Link to="/received-trades">받은 거래</Link>
                    <Link to="/sent-trade">보낸 거래</Link>
                    <Link to="/mypage">마이페이지</Link>

                    {loginUser ? (
                        <Link to="/logout">로그아웃</Link>
                    ) : (
                        <Link to="/login">로그인</Link>
                    )}
                </div>
            </nav>

            <header className="home-hero">
                <div className="home-hero-content">
                    <p className="home-hero-subtitle">
                        쉽고 빠른 중고거래 플랫폼
                    </p>

                    <h1>
                        우리 동네 중고거래
                        <br />
                        TradeHub
                    </h1>

                    <p className="home-hero-description">
                        필요한 물건은 합리적으로 찾고, 사용하지 않는 물건은 간편하게 판매해보세요.
                    </p>

                    <div className="home-hero-buttons">
                        <Link to="/products" className="home-hero-button primary">
                            상품 보러가기
                        </Link>

                        <Link to="/products/new" className="home-hero-button secondary">
                            상품 등록하기
                        </Link>
                    </div>
                </div>
            </header>
        </div>
    );
}

export default HomePage;