import { getSession } from "@/lib/auth";
import { Header } from "./Header";

export async function HeaderWithSession() {
  const session = await getSession();
  return <Header session={session} />;
}
