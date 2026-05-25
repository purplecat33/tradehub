import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ProductEditPage({ loginUser }) {
    const {id} = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title : "",
        price : "",
        description : "",
        productCondition: "GOOD",
    });

    const [image, setImage] = useState(null);
    const [currentImageUrl, setCurrentImageUrl] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");

    const fetchProduct = async () => {

        try {
            const response = await axios.get(`${BASE_URL}/api/products/${id}`);
            const product = response.data;

            setForm({
                title : product.title,
                price : product.price,
                description : product.description,
                productCondition: product.productCondition || "GOOD",
            });

            setCurrentImageUrl(product.imageUrl);

        } catch (error) {
            console.error("상품 조회 실패", error);
            
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

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const handleChange = (e) => {
        const {name, value} = e.target;

        setForm({
            ...form,
            [name] : value,
        });
    };

    const handleImageChange = (e) => {
        const selectedFile = e.target.files[0];

        setImage(selectedFile);

        if (selectedFile) {
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!loginUser) {
            alert("로그인 후 이용해주세요.");

            return;
        }

        try {
            const formData = new FormData();

            formData.append("title", form.title);
            formData.append("price", Number(form.price));
            formData.append("description", form.description);
            formData.append("productCondition", form.productCondition);
            formData.append("loginUserId", loginUser.id);

            if (image) {
                formData.append("image", image);
            }

            await axios.put(`${BASE_URL}/api/products/${id}`, formData, {
                headers: {
                    "Content-Type" : "multipart/form-data",
                },

                withCredentials: true,
            });
            

            alert("상품 수정 성공");
            navigate(`/products/${id}`);

        } catch (error) {
            console.error("상품 수정 실패", error);
            
            if (error.response) {
                const status = error.response.status;

                if (status === 403) {
                    alert("수정 권한이 없습니다.");

                } else if (status === 404) {
                    alert("상품을 찾을 수 없습니다.");

                } else {
                    alert("상품 수정에 실패했습니다.");
                }

            } else if (error.request) {
                alert("서버 응답이 없습니다.");

            } else {
                alert("요청 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-title">상품 수정</h1>

            <div className="form-card">
                <form onSubmit={handleSubmit} className="product-form">
                    <div className="form-group">
                        <label>상품명</label>
                        <input
                            type="text"
                            name="title"
                            placeholder="상품명"
                            value={form.title}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>가격</label>
                        <input
                            type="number"
                            name="price"
                            placeholder="가격"
                            value={form.price}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>상품 설명</label>
                        <textarea
                            name="description"
                            placeholder="상품 설명"
                            value={form.description}
                            onChange={handleChange}
                        />
                    </div>

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

                    <div className="image-preview-area">
                        <p>{previewUrl ? "선택한 이미지 미리보기" : "현재 이미지"}</p>

                        <img
                            src={
                                previewUrl
                                    ? previewUrl
                                    : currentImageUrl
                                    ? `${BASE_URL}/images/${currentImageUrl}`
                                    : "/no-image.png"
                            }
                            alt="현재 상품 이미지"
                            className="edit-preview-image"
                        />
                    </div>

                    <div className="form-group">
                        <label>이미지 변경</label>
                        <input
                            type="file"
                            accept="image/"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-actions">
                        <button type="button" className="secondary" onClick={() => navigate(-1)}>
                            취소
                        </button>

                        <button type="submit">
                            수정 완료
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ProductEditPage;