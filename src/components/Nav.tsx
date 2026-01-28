// 네비게이션 바 컴포넌트

import { useEffect, useRef, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Netflix_logo from "../images/Netflix_logo.svg";
import search_btn from "../images/search_btn.svg";
import styles from "./Nav.module.css";

function Nav() {
  // 스크롤 상태: 스크롤이 내려가면 true
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  // 검색 UI 상태: 검색창이 열려있는지
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);

  // 검색 입력값
  const [query, setQuery] = useState<string>("");

  // 검색창이 열릴 때 input에 자동 포커스를 주기위한 ref
  const inputRef = useRef<HTMLInputElement | null>(null);

  // 페이지 이동하기위함
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // "scroll"이 발생할 때마다 onScroll 함수를 실행하기
    window.addEventListener("scroll", onScroll);

    // Nav 컴포넌트가 사라질 때 이벤트 제거
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  // 검색창이 열릴 경우 input에 자동 포커스
  useEffect(() => {
    if (isSearchOpen) {
      inputRef.current?.focus();
    }
  }, [isSearchOpen]);

  // 검색 실행(엔터)
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = query.trim();
    if (!trimmed) return;

    navigate(`/search?q=${encodeURIComponent(trimmed)}`);

    // 검색 후 닫고 비우기
    setIsSearchOpen(false);
    setQuery('');
  };

  return (
    <nav
      className={styles.nav}
      style={{
        background: isScrolled ? "black" : "transparent",
      }}
    >
      {/* 왼쪽 로고 */}
      <img src={Netflix_logo} alt="Netflix logo" className={styles.logo} />
      {/* <h1 className={styles.logo}>NETFLIX</h1> */}

      {/* 오른쪽 탭 메뉴 */}
      <div className={styles.menu}>
        <NavLink
          to="/movies"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
        >
          영화
        </NavLink>

        <NavLink
          to="/tv"
          className={({ isActive }) =>
            `${styles.link} ${isActive ? styles.active : ""}`
          }
        >
          시리즈
        </NavLink>
      </div>

      <div className={styles.right}>
        {/* 돋보기 버튼: 누르면 검색창 토글 */}
        <button
          type="button"
          className={styles.searchBtn}
          onClick={() => setIsSearchOpen((prev) => !prev)}
          aria-label="검색"
        >
          <img className={styles.searchIcon} src={search_btn} alt="검색 버튼"/>
        </button>

        {/* 검색 폼: 열릴 때 width가 늘어나면서 input이 보이게 */}
        <form
          className={`${styles.searchForm} ${isSearchOpen ? styles.searchOpen : ""}`}
          onSubmit={handleSubmit}
        >
          <input
            ref={inputRef}
            className={styles.searchInput}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="제목으로 검색"
          />
        </form>
      </div>
    </nav>
  );
}

export default Nav;
