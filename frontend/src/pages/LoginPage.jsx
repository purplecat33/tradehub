import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function LoginPage({onLoginSuccess}) {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username : "",
        password : "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!form.username || !form.password) {
            alert("아이디와 비밀번호를 입력해주세요.");

            return;
        }

        try {
            const response = await axios.post(
                `${BASE_URL}/api/auth/login`,
                form,
                {
                    withCredentials : true,
                }
            );

            alert("로그인 성공");

            onLoginSuccess(response.data);

            navigate("/");

        } catch (error) {
            console.error("로그인 실패", error);
            
            if (error.response) {
                alert(error.response.data);

            } else if (error.request) {
                alert("서버에 연결할 수 없습니다.");

            } else {
                alert("로그인 요청 오류가 발생했습니다.");
            }
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${BASE_URL}/oauth2/authorization/google`;
    };

    return (
        <div className="auth-page">
            <h2>로그인</h2>

            <form onSubmit={handleLogin} className="auth-form">
                <input
                    type="text"
                    name="username"
                    placeholder="아이디"
                    value={form.username}
                    onChange={handleChange}
                />

                <input
                    type="password"
                    name="password"
                    placeholder="비밀번호"
                    value={form.password}
                    onChange={handleChange}
                />

                <button type="submit">로그인</button>
            </form>

            <button
                type="button"
                className="google-login-button"
                onClick={handleGoogleLogin}
            >
                구글로 로그인
            </button>

            <p className="auth-link">
                계정이 없으신가요? <Link to="/signup">회원가입</Link>
            </p>
        </div>
    );
}

export default LoginPage;