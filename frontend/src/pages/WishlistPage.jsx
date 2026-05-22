import { useEffect, useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function WishlistPage({loginUser}) {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    const getStatusText = (status) => {

        if (status === "AVAILABLE") {

            return "판매중";
        }

        if (status === "RESERVED") {

            return "거래중";
        }

        if (status === "SOLD") {

            return "판매완료";
        }

        return status;

    }

    const fetchWishlist = async () => {

        if (!loginUser) {
            setLoading(false);
            
            return;
        }

        try {
            const response = await axios.get(`${BASE_URL}/api/wishlist/user/${loginUser.id}`, {
                withCredentials: true,
            });

            setWishlist(response.data);

        } catch (error) {
            console.error('찜 목록 조회 실패', error);

            if (error.response) {
                alert("찜 목록을 불러오지 못했습니다.");

            } else if (error.request) {
                alert("서버 응답이 없습니다.");

            } else {
                alert("요청 처리 중 오류가 발생했습니다.");
            }

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, [loginUser]);

    const handleDelete = async (productId) => {

        if (!loginUser) {
            alert("로그인 후 이용해주세요");
            
            return;
        }
        
        try {
            await axios.delete(`${BASE_URL}/api/wishlist`, {
                params : {
                    userId : loginUser.id,
                    productId : productId,
                },

                withCredentials: true,
            });

            alert('찜이 삭제되었습니다.');
            fetchWishlist();

        } catch (error) {
            console.error('찜 삭제 실패', error);
            
            if (error.response) {

                if (error.response.status === 404) {
                    alert("이미 삭제되었거나 존재하지 않는 찜입니다.");

                } else {
                    alert("찜 삭제에 실패했습니다.");
                }

            } else if (error.request) {
                alert("서버 응답이 없습니다.");

            } else {
                alert("요청 처리 중 오류가 발생했습니다.");
            }
        }
    };

    if (loading) {

        return (
            <div className="page-container">
                <p className="empty-message">로딩 중...</p>
            </div>
        );
    }

    if (!loginUser) {

        return (
            <div className="page-container">
                <p className="empty-message">로그인 후 이용해주세요.</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <h1 className="page-title">내 찜 목록</h1>

            {wishlist.length === 0 ? (
                <p className="empty-message">찜한 상품이 없습니다.</p>
            ) : (
                <div className="product-grid">
                    {wishlist.map((item) => {
                        const product = item.product;

                        if (!product) {
                            
                            return null;
                        }

                        return (
                            <div className="product-card" key={item.id}>
                                <img
                                    className="product-image"
                                    src={
                                        product.imageUrl
                                            ? `${BASE_URL}/images/${product.imageUrl}`
                                            : "/no-image.png"
                                    }
                                    alt={product.title}
                                />

                                <h3 className="product-title">
                                    <Link to={`/products/${product.id}`}>
                                        {product.title}
                                    </Link>
                                </h3>

                                <p className="product-price">
                                    {product.price.toLocaleString()}원
                                </p>

                                {product.status && (
                                    <span className={`status-badge ${product.status.toLowerCase()}`}>
                                        {getStatusText(product.status)}
                                    </span>
                                )}

                                <p className="product-description">
                                    {product.description}
                                </p>

                                <div className="card-actions">
                                    <Link to={`/produts/${product.id}`}>
                                        <button type="button" className="secondary">
                                            상세 보기
                                        </button>
                                    </Link>

                                    <button
                                        type="button"
                                        className="danger"
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        찜 삭제
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default WishlistPage;