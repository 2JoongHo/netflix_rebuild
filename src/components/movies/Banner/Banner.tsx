import styles from "./Banner.module.css";

interface BannerItem {
    title: string;
    overview: string;
    backdropUrl: string; // 배너 배경 이미지 URL
}

export default function Banner() {
    const item: BannerItem = {
        title: "NETFILX ORIGINAL",
        overview: "지금부터 UI를 만드는 단게야. 다음 단계에서 TMDB에서 랜덤으로 하나 골라서 배너를 채울꺼야.",
        backdropUrl: "https://images.unsplash.com/photo-1524985069026-dd778a71c7b4?auto=format&fit=crop&w=1600&q=80",
    }

    return (
        <header
            className={styles.banner}
            style={{backgroundImage: `url(${item.backdropUrl})`}}    
        >
            <div className={styles.content}>
                <h2 className={styles.title}>
                    {item.title}
                </h2>

                <div className={styles.buttons}>
                    <button className={`${styles.button} ${styles.play}`}>Play</button>
                    <button className={`${styles.button} ${styles.info}`}>More Info</button>
                </div>

                <p className={styles.desc}>{item.overview}</p>
            </div>

            <div className={styles.fadeBottom}/>

        </header>
    )
}
