import { useEffect, useState } from "react";
import axios from "axios";
import {Link} from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function ProductListPage({loginUser}) {
    const [products, setProducts] = useState([]);
    const [keyword, setKeyword] = useState("");
    const [statusFilter, setStatusFilter] = useState("전체");
    const [loading, setLoading] = useState(false);
    const [sortType, setSortType] = useState("latest");
    const [imageFile, setImageFile] = useState(null);

    const [form, setForm] = useState({
        title: "",
        price: "",
        description: "",
        productCondition: "GOOD",
    });

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

    const getConditionText = (productCondition) => {

        if (productCondition === "GOOD") {

            return "좋음";
        }

        if (productCondition === "NORMAL") {

            return "보통";
        }

        if (productCondition === "BAD") {

            return "나쁨";
        }

        return productCondition || "-";
    }

    const sortProducts = (productList) => {
        const sortedProducts = [...productList];

        if (sortType === "priceAsc") {
            sortedProducts.sort((a, b) => a.price - b.price);

        } else if (sortType === "priceDesc") {
            sortedProducts.sort((a, b) => b.price - a.price);

        } else {
            sortedProducts.sort((a, b) => b.id - a.id);
        }

        return sortedProducts;
    };

    const searchProducts =async () => {

        try {
            setLoading(true);

            let response;

            if (!keyword.trim()) {
                response = await axios.get(`${BASE_URL}/api/products`);

            } else {
                response = await axios.get(`${BASE_URL}/api/products/search`, {
                    params: {
                        keyword: keyword,
                    },
                });
            }

            let filteredProducts = response.data;

            if (statusFilter !== "전체") {
                filteredProducts = filteredProducts.filter(
                    (product) => product.status === statusFilter
                );
            }
            
            const sortedProducts = sortProducts(filteredProducts);
            setProducts(sortedProducts);

        } catch (error) {
            console.error("상품 검색 실패", error);
            
            if (error.response) {
                alert("상품 목록을 불러오지 못했습니다.");

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
        searchProducts();
    }, [keyword, statusFilter, sortType]);

    const handleChange = (e) => {
        const {name, value} = e.target;

        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleKeywordChange = (e) => {
        setKeyword(e.target.value);
    };

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const handleSortChange = (e) => {
        setSortType(e.target.value);
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!loginUser) {
            alert("로그인 후 이용해주세요");
            
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

            setForm({
                title:"",
                price:"",
                description:"",
                productCondition:"GOOD",
            });

            setImageFile(null);
            searchProducts();

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

    const deleteProduct = async (id) => {

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
            searchProducts();

        } catch (error) {
            console.error("상품 삭제 실패", error);
            
            if (error.response) {
                const status = error.response.status;

                if (status === 403) {
                    alert("삭제 권한이 없습니다.");

                } else if (status === 404) {
                    alert("이미 삭제된 상품입니다.")

                } else {
                    alert("서버 오류로 삭제에 실패했습니다.");
                }

            } else if (error.request) {
                alert("서버 응답이 없습니다.");

            } else {
                alert("요청 처리 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className="page-container">
            <h1 className="page-title">중고거래 상품 관리</h1>

            <div className="form-card">
                <h2 className="section-title">상품 등록</h2>
            

                <form onSubmit={handleSubmit} className="product-form">
                    <input
                        type = "text"
                        name = "title"
                        placeholder = "상품명"
                        value = {form.title}
                        onChange = {handleChange}
                    />

                
                    <input
                        type = "number"
                        name = "price"
                        placeholder = "가격"
                        value = {form.price}
                        onChange = {handleChange}
                    />

                    <textarea
                        name = "description"
                        placeholder = "상품 설명"
                        value = {form.description}
                        onChange = {handleChange}
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
                        onChange={handleFileChange}
                    />

                    <div className="form-actions">
                        <button type="submit">상품 등록</button>
                    </div>
                </form>
            </div>
        
        <h2 className="section-title">상품 목록</h2>

        <div className="filter-bar">
            <input
                type="text"
                placeholder="상품명을 입력하세요"
                value={keyword}
                onChange={handleKeywordChange}
            />

            <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
            >
                <option value="전체">전체</option>
                <option value="AVAILABLE">판매중</option>
                <option value="RESERVED">거래중</option>
                <option value="SOLD">판매완료</option>
            </select>

            <select
                value={sortType}
                onChange={handleSortChange}
            >
                <option value="latest">최신순</option>
                <option value="priceAsc">가격 낮은 순</option>
                <option value="priceDesc">가격 높은 순</option>
            </select>

            <button
                type="button"
                className="secondary"
                onClick={() => {
                    setKeyword("");
                    setStatusFilter("전체");
                    setSortType("latest");
                }}

            >
                초기화
            </button>
        </div>

        {loading ? (
            <p className="empty-message">상품 목록을 불러오는 중입니다.</p>
        ) : products.length === 0 ? (
            <p className="empty-message">검색 결과가 없습니다.</p>
        ) : (
            <div className="product-grid">
                {products.map((product) => (
                    <div className="product-card" key={product.id}>
                        <img
                            className="product-image"
                            src={
                                product.imageUrl
                                    ? `${BASE_URL}/images/${product.imageUrl}`
                                    : "/no-image.png"
                            }

                            alt = {product.title}
                        />

                        <h3 className="product-title">
                            <Link to={`/products/${product.id}`}>
                                {product.title}
                            </Link>
                        </h3>

                        <p className="product-price">
                            {product.price.toLocaleString()}원
                        </p>

                        <span className={`status-badge ${product.status.toLowerCase()}`}>
                            {getStatusText(product.status)}
                        </span>

                        <p className="product-condition">
                            상품 상태 : {getConditionText(product.productCondition)}
                        </p>

                        <p className="product-description">
                            {product.description}
                        </p>

                        {loginUser && product.user && loginUser.id === product.user.id && (
                            <div className="card-actions">
                                <Link to={`/products/edit/${product.id}`}>
                                    <button type="button" className="secondary">
                                        수정
                                    </button>
                                </Link>

                                <button
                                    type="button"
                                    className="danger"
                                    onClick={() => deleteProduct(product.id)}
                                >
                                    삭제
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        )}
        </div>
    );
}

export default ProductListPage;