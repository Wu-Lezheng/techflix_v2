import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import styles from "./page.module.css";

export default async function Landing() {

  const session = await getServerSession(authOptions);

  return (
    <main>
      <div>
        <button>
          <Link href="/login">Get Started</Link>
        </button>
        <pre>{JSON.stringify(session)}</pre>
      </div>
    </main>
  );
}
