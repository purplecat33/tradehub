import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ReceivedTradePage({ loginUser }) {
    const [trades, setTrades] = useState([]);

    const getTradeStatusText = (status) => {
        
        if (status === "REQUESTED") {

            return "요청중";
        }

        if (status === "ACCEPTED") {

            return "수락됨";
        }

        if (status === "REJECTED") {

            return "거절됨";
        }

        if (status === "COMPLETED") {

            return "거래완료";
        }

        if (status === "CANCELED") {

            return "취소됨";
        }

        return status;
    }

    const getTradeStatusClass = (status) => {

        if (status === "REQUESTED") {

            return "available";
        }

        if (status === "ACCEPTED") {

            return "reserved";
        }

        if (status === "COMPLETED") {

            return "sold";
        }

        if (status === "REJECTED") {

            return "sold";
        }

        return "";
    }

    const getProductImageUrl = (product) => {

        if (!product || !product.imageUrl) {

            return "/no-image.png";
        }

        if (product.imageUrl.startsWith("http")) {

            return product.imageUrl;
        }

        return `${BASE_URL}/images/${product.imageUrl}`;
    };

    const fetchReceivedTrades = async () => {

        if (!loginUser) {

            return;
        }

        try {
            const response = await axios.get(`${BASE_URL}/api/trades/received`, {
                params: {
                    sellerId: loginUser.id,
                },
                withCredentials: true,
            });

            console.log(response.data);

            setTrades(response.data);

        } catch (error) {
            console.error("받은 거래 요청 조회 실패", error);

            if (error.response) {
                alert(error.response.data);

            } else {
                alert("서버 응답이 없습니다.");
            }
        }
    };

    const handleAcceptTrade = async (tradeId) => {

        if (!loginUser) {
            alert("로그인 후 이용해주세요.");
            
            return;
        }

        try {
            await axios.put(`${BASE_URL}/api/trades/${tradeId}/accept`, null, {
                params: {
                    sellerId: loginUser.id,
                },
                withCredentials: true,
            });

            alert("거래 요청을 수락했습니다.");

            fetchReceivedTrades();

        } catch (error) {
            console.error("거래 수락 실패", error);

            if (error.response) {
                alert(error.response.data);

            } else {
                alert("서버 응답이 없습니다.");
            }
        }
    };

    const handleRejectTrade = async (tradeId) => {

        if (!loginUser) {
            alert("로그인 후 이용해주세요.");

            return;
        }

        try {
            await axios.put(`${BASE_URL}/api/trades/${tradeId}/reject`, null, {
                params: {
                    sellerId: loginUser.id,
                },
                withCredentials: true,
            });

            alert("거래 요청을 거절했습니다.");

            fetchReceivedTrades();

        } catch (error) {
            console.error("거래 거절 실패", error);

            if (error.response) {
                alert(error.response.data);

            } else {
                alert("서버 응답이 없습니다.");
            }
        }
    };

    const handleCompleteTrade = async (tradeId) => {

        if (!loginUser) {
            alert("로그인 후 이용해주세요.");

            return;
        }

        try {
            await axios.put(`${BASE_URL}/api/trades/${tradeId}/complete`, null, {
                params: {
                    sellerId: loginUser.id,
                },
                withCredentials: true,
            });

            alert("거래가 완료 처리되었습니다.");

            fetchReceivedTrades();

        } catch (error) {
            console.error("거래 완료 실패", error);

            if (error.response) {
                alert(error.response.data);

            } else {
                alert("서버 응답이 없습니다.");
            }
        }
    }

    useEffect(() => {
        fetchReceivedTrades();
    }, [loginUser]);

    if (!loginUser) {

        return (
            <div className="page-container">
                <div className="product-page-hero">
                    <div className="product-page-hero-content">
                        <h1>받은 거래 요청</h1>
                    </div>
                </div>

                <p className="empty-message">로그인 후 이용해주세요.</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <div className="product-page-hero">
                <div className="product-page-hero-content">
                    <h1>받은 거래 요청</h1>
                </div>
            </div>

            <section className="trade-section">
                {trades.length === 0 ? (
                    <p className="empty-message">받은 거래 요청이 없습니다.</p>
                ) : (
                    <div className="trade-list">
                        {trades.map((trade) => (
                            <div className="trade-card trade-card-row" key={trade.id}>
                                <img
                                    src={getProductImageUrl(trade.product)}
                                    alt={trade.product.title}
                                    className="trade-product-image"
                                />

                                <div className="trade-info">
                                    <h2>{trade.product.title}</h2>

                                    <p className="trade-price">
                                        {trade.product.price.toLocaleString()}원
                                    </p>

                                    <p className="trade-meta">
                                        구매자: {trade.buyer.username}
                                    </p>

                                    <span className={`status-badge ${getTradeStatusClass(trade.status)}`}>
                                        {getTradeStatusText(trade.status)}
                                    </span>

                                    {trade.status === "REQUESTED" && (
                                        <div className="trade-actions">
                                            <button
                                                type="button"
                                                onClick={() => handleAcceptTrade(trade.id)}
                                            >
                                                수락
                                            </button>

                                            <button
                                                type="button"
                                                className="danger"
                                                onClick={() => handleRejectTrade(trade.id)}
                                            >
                                                거절
                                            </button>
                                        </div>
                                    )}

                                    {trade.status === "ACCEPTED" && (
                                        <div className="trade-actions">
                                            <button
                                                type="button"
                                                onClick={() => handleCompleteTrade(trade.id)}
                                            >
                                                거래 완료
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
}

export default ReceivedTradePage;