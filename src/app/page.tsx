import { redirect } from "next/navigation";

export default function Home() {
  // Redirect users to the dashboard
  // Next.js middleware or Auth.js will intercept this and send them to /login if unauthenticated
  redirect("/dashboard");
}
