import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function SignupPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        username: "",
        password: "",
        name: "",
        email: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!form.username.trim()) {
            alert("아이디를 입력해주세요.");

            return;
        }

        if (!form.password.trim()) {
            alert("비밀번호를 입력해주세요.");

            return;
        }

        if (form.password.length < 4) {
            alert("비밀번호는 4자리 이상 입력해주세요.");

            return;
        }

        if (!form.name.trim()) {
            alert("이름을 입력해주세요.");

            return;
        }

        if (!form.email.trim()) {
            alert("이메일을 입력해주세요.");

            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(form.email)) {
            alert("올바른 이메일 형식으로 입력해주세요.");

            return;
        }

        try {
            await axios.post(`${BASE_URL}/api/auth/signup`, form, {
                withCredentials: true,
            });

            alert("회원가입이 완료되었습니다.");
            navigate("/login");

        } catch (error) {
            console.error("회원가입 실패", error);

            if (error.response) {
                alert(error.response.data);

            } else if (error.request) {
                alert("서버에 연결할 수 없습니다.");

            } else {
                alert("회원가입 요청 중 오류가 발생했습니다.");
            }
        }
    };

    return (
        <div className="auth-page">
            <h2>회원가입</h2>

            <form onSubmit={handleSignup} className="auth-form">
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

                <input
                    type="text"
                    name="name"
                    placeholder="이름"
                    value={form.name}
                    onChange={handleChange}
                />

                <input
                    type="text"
                    name="email"
                    placeholder="이메일"
                    value={form.email}
                    onChange={handleChange}
                />

                <button type="submit">회원가입</button>
            </form>

            <p className="auth-link">
                이미 계정이 있으신가요? <Link to="/login">로그인</Link>
            </p>
        </div>
    )
}

export default SignupPage;