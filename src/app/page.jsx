import CompanyHighlight from "@/components/company-highlight/CompanyHighlight";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { authOptions } from "./api/auth/[...nextauth]/route";
import styles from "./page.module.css";

export default async function Landing() {

  const session = await getServerSession(authOptions);

  return (
    <main>
      <div className={styles.landingTop}>
        <div className={styles.logoSection}>
          <Image src="/logo.png" alt="Logo" width={48} height={48}></Image>
          <h1 style={{ fontWeight: "700" }}>TECHFLIX</h1>
        </div>
        <div className={styles.topButtonContainer}>
          <Link href="/contact">Contact Us</Link>
          <Link href="/login">
            <button>Sign In</button>
          </Link>
        </div>
      </div>
      <div className={styles.contentContainer}>
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
            Join us as we embrace the forefront of innovation. Embark on a voyage of exploration, empowerment, and endless fascination.</p>
        </div>

        <CompanyHighlight></CompanyHighlight>
      </div>
    </main>
  );
}
