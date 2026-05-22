import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function MyPage({loginUser, setLoginUser}) {
    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [editMode, setEditMode] = useState(false);
    const [editName, setEditName] = useState("");
    const [editEmail, setEditEmail] = useState("");
    
    const formatDate = (dateValue) => {
        
        if (!dateValue) {

            return "-";
        }

        const date = new Date(dateValue);

        return date.toLocaleString("ko-KR", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getProviderText = (provider) => {

        if (provider === "local") {

            return "일반 로그인";
        }

        if (provider === "google") {

            return "구글 로그인";
        }

        return provider || "-";
    };

    const fetchMyInfo = async () => {

        try {
            const response = await axios.get(`${BASE_URL}/api/auth/me`, {
                withCredentials: true,
            });

            setUser(response.data);

            setEditName(response.data.name || "");
            setEditEmail(response.data.email || "");

        } catch (error) {
            console.error("마이페이지 정보 조회 실패", error);

            if (error.response) {

                if (error.response.status === 400 || error.response.status === 401) {
                    setError("로그인 후 이용할 수 있습니다.");

                } else {
                    setError("사용자 정보를 불러오지 못했습니다.");
                }

            } else {
                setError("서버와 연결할 수 없습니다.");
            }

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyInfo();
    }, []);

    const handleEditClick = () => {
        setEditMode(true);
        setEditName(user.name || "");
        setEditEmail(user.email || "");
    };

    const handleCancelEdit = () => {
        setEditMode(false);
        setEditName(user.name || "");
        setEditEmail(user.email || "");
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();

        if (!editName.trim()) {
            alert("이름을 입력해주세요.");

            return;
        }

        if (!editEmail.trim()) {
            alert("이메일을 입력해주세요.");

            return;
        }

        try {
            const response = await axios.put(
                `${BASE_URL}/api/auth/me`,
                {
                    name: editName,
                    email: editEmail,
                },
                {
                    withCredentials: true,
                }
            );

            setUser(response.data);

            setEditMode(false);

            alert("회원 정보가 수정되었습니다.");

        } catch (error) {
            console.error("회원 정보 수정 실패", error);

            if (error.response) {
                alert(error.response.data);

            } else if (error.request) {
                alert("서버 응답이 없습니다.");

            } else {
                alert("회원 정보 수정 요청 중 오류가 발생했습니다.");
            }
        }
    };

    const handleDeleteAccount = async () => {

        const confirmDelete = window.confirm (
            "정말 회원탈퇴를 하시겠습니까?\n 탈퇴 후 계정 정보는 복구할 수 없습니다."
        );

        if (!confirmDelete) {

            return;
        }

        try {
            await axios.delete(`${BASE_URL}/api/auth/me`, {
                withCredentials: true,
            });

            alert("회원탈퇴가 완료되었습니다.");

            setLoginUser(null);

            navigate("/");

        } catch (error) {
            console.error("회원탈퇴 실패", error);

            if (error.response) {
                alert(error.response.data);

            } else if (error.request) {
                alert("서버 응답이 없습니다.");

            } else {
                alert("회원탈퇴 요청 중 오류가 발생했습니다.");
            }
        }
    };

    if (loading) {
        
        return (
            <div className="mypage-container">
                <h2>마이페이지</h2>
                <p>사용자 정보를 불러오는 중입니다...</p>
            </div>
        );
    }

    if (error) {

        return (
            <div className="mypage-container">
                <h2>마이페이지</h2>
                <p>{error}</p>

                <Link to="/login">로그인하러 가기</Link>
            </div>
        );
    }

    return (
        <div className="mypage-container">
            <h2>마이페이지</h2>

            <div className="mypage-card">
                {!editMode ? (
                    <>
                        <div className="mypage-info-row">
                            <strong>아이디</strong>
                            <span>{user.username || "-"}</span>
                        </div>

                        <div className="mypage-info-row">
                            <strong>이름</strong>
                            <span>{user.name || "-"}</span>
                        </div>

                        <div className="mypage-info-row">
                            <strong>이메일</strong>
                            <span>{user.email || "-"}</span>
                        </div>

                        <div className="mypage-info-row">
                            <strong>로그인 방식</strong>
                            <span>{getProviderText(user.provider)}</span>
                        </div>

                        <div className="mypage-info-row">
                            <strong>가입일</strong>
                            <span>{formatDate(user.createdAt)}</span>
                        </div>

                        <div className="button-area">
                            <button
                                type="button"
                                className="primary-button"
                                onClick={handleEditClick}
                            >
                                수정
                            </button>
                            
                            <button
                                type="button"
                                className="danger"
                                onClick={handleDeleteAccount}
                            >
                                회원탈퇴
                            </button>
                        </div>
                    </>
                ) : (
                    <>
                        <form onSubmit={handleUpdateUser} className="mypage-edit-form">
                            <div className="mypage-info-row">
                                <strong>아이디</strong>
                                <span>{user.username || "-"}</span>
                            </div>

                            <div className="form-group">
                                <label>이름</label>
                                <input
                                    type="text"
                                    value={editName}
                                    onChange={(e) => setEditName(e.target.value)}
                                />
                            </div>

                            <div className="form-group">
                                <label>이메일</label>
                                <input
                                    type="text"
                                    value={editEmail}
                                    onChange={(e) => setEditEmail(e.target.value)}
                                />
                            </div>

                            <div className="mypage-info-row">
                                <strong>로그인 방식</strong>
                                <span>{getProviderText(user.provider)}</span>
                            </div>

                            <div className="mypage-info-row">
                                <strong>가입일</strong>
                                <span>{formatDate(user.createdAt)}</span>
                            </div>

                            <div className="button-area">
                                <button type="submit" className="primary-button">
                                    저장
                                </button>

                                <button
                                    type="button"
                                    className="secondary-button"
                                    onClick={handleCancelEdit}
                                >
                                    취소
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>

            <br />

            <Link to="/" className="mypage-back-link">상품 목록으로 이동</Link>
        </div>
    );
}

export default MyPage;