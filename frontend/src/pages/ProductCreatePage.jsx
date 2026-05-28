import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ProductCreatePage({ loginUser }) {
    const navigate = useNavigate();
    const [imageFile, setImageFile] = useState(null);

    const [form, setForm] = useState({
        title: "",
        price: "",
        description: "",
        productCondition: "GOOD",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!loginUser) {
            alert("로그인 후 이용해주세요.");
            navigate("/login");

            return;
        }

        try {
            const formData = new FormData();
            formData.append("title", form.title);
            formData.append("price", Number(form.price));
            formData.append("description", form.description);
            formData.append("productCondition", form.productCondition);
            formData.append("userId", loginUser.id);

            if (imageFile) {
                formData.append("image", imageFile);
            }

            await axios.post(`${BASE_URL}/api/products`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                
                withCredentials: true,
            });

            alert("상품 등록 성공");
            navigate("/products");

        } catch (error) {
            console.error("상품 등록 실패", error);

            if (error.response) {
                alert("상품 등록에 실패했습니다. 입력값을 확인해주세요.");

            } else if (error.request) {
                alert("서버와 연결되지 않았습니다.");

            } else {
                alert("요청 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className="page-container">
            <div className="product-page-hero-content">
                <h1 className="page-title">상품 등록</h1>
                <p className="page-description">
                    판매할 상품의 정보와 이미지를 입력해주세요.
                </p>
            </div>

            <section className="product-register-section">
                <div className="form-card">
                    <form onSubmit={handleSubmit} className="product-form">
                        <input
                            type="text"
                            name="title"
                            placeholder="상품명"
                            value={form.title}
                            onChange={handleChange}
                        />

                        <input
                            type="number"
                            name="price"
                            placeholder="가격"
                            value={form.price}
                            onChange={handleChange}
                        />

                        <textarea
                            name="description"
                            placeholder="상품 설명"
                            value={form.description}
                            onChange={handleChange}
                        />

                        <div className="form-group">
                            <label>상품 상태</label>
                            <select
                                name="productCondition"
                                value={form.productCondition}
                                onChange={handleChange}
                            >
                                <option value="GOOD">좋음</option>
                                <option value="NORMAL">보통</option>
                                <option value="BAD">나쁨</option>
                            </select>
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleChange}
                        />

                        <div className="form-actions">
                            <button type="submit">상품 등록</button>

                            <Link to="/products">
                                <button type="button" className="secondary">
                                    목록으로
                                </button>
                            </Link>
                        </div>
                    </form>
                </div>
            </section>
        </div>
    );
}

export default ProductCreatePage;