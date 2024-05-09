import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function Landing() {

  const session = await getServerSession(authOptions);

  return (
    <main>
      <div>
        <button>
          <Link href="/login">Sign In</Link>
        </button>
        <button>
          <Link href="/home">Get Started</Link>
        </button>
        {
          session
            ? (<p>{session.user.id}</p>)
            : (<p>You are not signed in</p>)
        }
      </div>
    </main>
  );
}
