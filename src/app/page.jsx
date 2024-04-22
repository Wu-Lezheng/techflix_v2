import Link from "next/link";
import styles from "./page.module.css";

export default function Landing() {
  return (
    <main>
      <div>
        <button>
          <Link href="/login">Get Started</Link>
        </button>
      </div>
    </main>
  );
}
