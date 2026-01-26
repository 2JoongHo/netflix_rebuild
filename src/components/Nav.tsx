// 네비게이션 바 컴포넌트

import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Nav.module.css";

function Nav() {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    // "scroll"이 발생할 때마다 onScroll 함수를 실행하기
    window.addEventListener("scroll", onScroll);

    // Nav 컴포넌트가 사라질 때 이벤트 제거
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <nav
      className={styles.nav}
      style={{
        background: isScrolled ? "black" : "transparent",
      }}
    >
      {/* 왼쪽 로고 */}
      <img src="/Netflix_logo.svg" alt="Netflix logo" className={styles.logo} />
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
    </nav>
  );
}

export default Nav;
