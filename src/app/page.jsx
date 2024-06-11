import CompanyHighlight from "@/components/company-highlight/CompanyHighlight";
import LandingTop from "@/components/utils/landing-top/LandingTop";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "./api/auth/[...nextauth]/route";
import styles from "./page.module.css";

export default async function Landing() {

  const session = await getServerSession(authOptions);

  return (
    <main>

      <LandingTop></LandingTop>

      <div className={styles.bgImage}>

        <div className={styles.borderShadow}></div>

        <div className={styles.titleSection}>
          <h1>Discover Tomorrow. Explore Tech Wonders with <span className={styles.highlightedName}>Techflix</span> </h1>
          <p className={styles.description}> Dive into a realm where cutting-edge ST Engineering products, ranging from smart city & digital solutions to defence & public safety technologies,
            converge to redefine the boundaries of possibility.
          </p>
          <Link href="/home">
            <button className={styles.gradientButton}>Get Started</button>
          </Link>
        </div>

        <div className={styles.introSection}>
          <h2 style={{ minWidth: "20%" }}>Introduction To Techflix</h2>
          <p className={styles.description}>Techflix is a website for ST Engineering to showcase products and demos under various categories,
            offering enthusiasts and industry professionals alike the opportunity to explore, interact, and envision the future.
            Join us as we embrace the forefront of innovation. Embark on a voyage of exploration, empowerment, and endless fascination.
          </p>
        </div>

        <div className={styles.companyHighlightContent}>
          <CompanyHighlight></CompanyHighlight>
        </div>

      </div>

    </main>
  );
}
