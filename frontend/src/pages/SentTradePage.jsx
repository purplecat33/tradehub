import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SentTradePage({loginUser}) {
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

    const fetchSentTrades = async () => {
        if (!loginUser) {
            
            return;

        }

        try {
            const response = await axios.get(`${BASE_URL}/api/trades/sent`, {
                params: {
                    buyerId: loginUser.id,
                },
                withCredentials: true,
            });

            console.log(response.data);

            setTrades(response.data);

        } catch (error) {
            console.error("보낸 거래 요청 목록 조회 실패", error);

            if (error.response) {
                alert(error.response.data);

            } else {
                alert("보낸 거래 요청 목록을 불러오지 못했습니다.");
            }
        }
    };

    useEffect(() => {
        fetchSentTrades();
    }, [loginUser]);

    if (!loginUser) {
        
        return (
            <div className="page-container">
                <p className="empty-message">로그인 후 이용해주세요.</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            <h1 className="page-title">내가 보낸 거래 요청</h1>

            {trades.length === 0 ? (
                <p className="empty-message">보낸 거래 요청이 없습니다.</p>
            ) : (
                trades.map((trade) => (
                    <div className="trade-card" key={trade.id}>
                        <img
                            src={getProductImageUrl(trade.product)}
                            alt={trade.product.title}
                            className="trade-product-image"
                        />

                        <h2>{trade.product.title}</h2>

                        <p className="product-price">
                            {trade.product.price.toLocaleString()}원
                        </p>

                        <p>판매자:{trade.seller.username}</p>

                        <span className={`status-badge ${getTradeStatusClass(trade.status)}`}>
                            {getTradeStatusText(trade.status)}
                        </span>
                    </div>
                ))
            )}
        </div>
    );
}

export default SentTradePage;