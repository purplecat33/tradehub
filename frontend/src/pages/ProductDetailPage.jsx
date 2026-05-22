import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ProductDetailPage({loginUser}) {
    const {id} = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);

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
    };

    const fetchProduct = async () => {

        try {
            const response = await axios.get(`${BASE_URL}/api/products/${id}`);
            setProduct(response.data);

        } catch (error) {
            console.error("상품 상세 조회 실패", error);

            if (error.response) {

                if (error.response.status === 404) {
                    alert("상품을 찾을 수 없습니다.");

                } else {
                    alert("상품 정보를 불러오지 못했습니다.");
                }

            } else if (error.request) {
                alert("서버 응답이 없습니다.");

            } else {
                alert("요청 오류가 발생했습니다.");
            }
        }
    };

    const handleAddWishlist = async () => {

        if (!loginUser) {
            alert("로그인 후 이용해주세요");

            return;
        }

        try {
            await axios.post(`${BASE_URL}/api/wishlist`, null, {
                params : {
                    userId : loginUser.id,
                    productId : product.id,
                },
                withCredentials : true,
            });

            alert("찜 추가 성공");

        } catch (error) {
            console.error("찜 추가 실패", error);

            if (error.response) {
                const status = error.response.status;

                if (status === 400) {
                    alert(error.response.data || "이미 찜한 상품입니다.");

                } else if (status === 404) {
                    alert("상품 정보를 찾을 수 없습니다.");

                } else {
                    alert("찜 추가에 실패했습니다.");
                }

            } else if (error.request) {
                alert("서버 응답이 없습니다.");

            } else {
                alert("요청 오류가 발생했습니다.");
            }
            
        }
    };
    
    const handleDeleteProduct = async () => {

        if (!loginUser) {
            alert("로그인 후 이용해주세요");

            return;
        }

        try {
            await axios.delete(`${BASE_URL}/api/products/${id}`, {
                params : {
                    loginUserId : loginUser.id,
                },
                withCredentials: true,
            });

            alert("상품 삭제 성공");
            navigate("/");

        } catch (error) {
            console.error("상품 삭제 실패", error);
            
            if (error.response) {
                const status = error.response.status;

                if (status === 403) {
                    alert("삭제 권한이 없습니다.");

                } else if (status === 404) {
                    alert("이미 삭제되었거나 존재하지 않는 상품입니다.");

                } else {
                    alert("서버 오류로 삭제에 실패했습니다.");
                }

            } else if (error.request) {
                alert("서버 응답이 없습니다.");

            } else {
                alert("요청 오류가 발생했습니다.");
            }
        }
    };

    const handleRequestTrade = async () => {

        if (!loginUser) {
            alert("로그인 후 이용해주세요.");
            
            return;
        }

        if (loginUser.id === product.user.id) {
            alert("본인 상품에는 거래 요청을 할 수 없습니다.");

            return;
        }

        try {
            await axios.post(`${BASE_URL}/api/trades`, null, {
                params: {
                    buyerId: loginUser.id,
                    productId: product.id,
                },
                withCredentials: true,
            });

            alert("거래 요청이 완료되었습니다.");

        } catch (error) {
            console.error("거래 요청 실패", error);

            const message = error.response?.data || "거래 요청 중 오류가 발생했습니다.";
            alert(message);
        }
    }

    useEffect(() => {
        fetchProduct();
    }, [id]);

    if (!product) {

        return (
            <div className="page-container">
                <p className="empty-message">상품 정보를 불러오는 중입니다.</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <h1 className="page-title">상품 상세</h1>

            <div className="detail-card">
                <img
                    className="detail-image"
                    src={
                        product.imageUrl
                        ? `${BASE_URL}/images/${product.imageUrl}`
                        : "/no-image.png"
                    }
                    alt={product.title}
                />

                <h2 className="detail-title">{product.title}</h2>
                <div className="detail-info">
                    <p className="product-price">
                        {product.price.toLocaleString()}원
                    </p>

                    <span className={`status-badge ${product.status.toLowerCase()}`}>
                        {getStatusText(product.status)}
                    </span>

                    <p>{product.description}</p>
                </div>

                <div className="detail-actions">
                    <button type="button" onClick={handleAddWishlist}>
                        찜하기
                    </button>

                    {loginUser &&
                        product.user &&
                        loginUser.id !== product.user.id &&
                        product.status === "AVAILABLE" && (
                            <button type="button" onClick={handleRequestTrade}>
                                거래 요청하기
                            </button>
                        )}

                        {loginUser &&
                            product.user &&
                            loginUser.id !== product.user.id &&
                            product.status === "RESERVED" && (
                                <button type="button" className="secondary" disabled>
                                    현재 거래중
                                </button>
                        )}

                        {loginUser &&
                            product.user &&
                            loginUser.id !== product.user.id &&
                            product.status === "SOLD" && (
                                <button type="button" className="secondary" disabled>
                                    판매완료
                                </button>
                        )}
                </div>

                {loginUser && product.user && loginUser.id === product.user.id && (
                    <div className="detail-action">
                        <button
                            type="button"
                            className="secondary"
                            onClick={() => navigate(`/products/edit/${product.id}`)}
                        >
                            수정
                        </button>

                        <button
                            type="button"
                            className="danger"
                            onClick={handleDeleteProduct}
                        >
                            삭제
                        </button>
                    </div>
                )}

                <div className="detail-action">
                    <Link to="/">
                        <button type="button" className="secondary">
                            목록으로 돌아가기
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ProductDetailPage;