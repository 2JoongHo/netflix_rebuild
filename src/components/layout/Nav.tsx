import { useEffect, useState } from "react";
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
        }
    }, [])

    return (
        <nav 
            className={styles.nav}
            style={{
            background: isScrolled ? "black" : "transparent",        
            }}
        >
            <h1 className={styles.logo}>NETFLIX</h1>
        </nav>
    )
}

export default Nav;