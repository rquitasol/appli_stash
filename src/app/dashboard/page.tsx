import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import { cookies } from "next/headers";
import { verifyJwt, JwtUser } from "../../lib/jwt";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const user = token ? verifyJwt(token) as JwtUser : null;
  if (!user) redirect("/");
  return (
    <div className="flex flex-col h-screen w-full">
      <div className="flex-shrink-0" style={{height: '5%'}}>
        <Header />
      </div>
      <main className="flex-grow" style={{height: '90%'}}>
        <h2 className="text-3xl font-bold mb-6">Dashboard</h2>
        <div className="bg-accent rounded shadow p-6">
          <p>Welcome to your dashboard! Here you can manage your account and view your data.</p>
        </div>
      </main>
      <div className="flex-shrink-0" style={{height: '5%'}}>
        <Footer />
      </div>
    </div>
  );
}
