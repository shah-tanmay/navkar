import { NextPage } from "next";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { toast } from "react-toastify";
import Head from "next/head";

const LoginContainer = styled.div`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #111;
  font-family: "Outfit", sans-serif;
`;

const LoginCard = styled.div`
  background: #fff;
  padding: 3rem;
  border-radius: 12px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 20px 40px rgba(0,0,0,0.4);
  text-align: center;
`;

const Logo = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: #111;
  margin-bottom: 0.5rem;
  span { color: #D4AF37; }
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  &:focus { outline: none; border-color: #D4AF37; }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: #111;
  color: #D4AF37;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  &:hover { background: #000; letter-spacing: 1px; }
`;

const AdminLogin: NextPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user?.role === "admin") {
      router.push("/admin/dashboard");
    }
  }, [session, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error("Invalid Credentials or Access Denied");
    } else {
      toast.success("Welcome back, Commander");
    }
  };

  return (
    <LoginContainer>
      <Head><title>Secure Admin Access | Navkar</title></Head>
      <LoginCard>
        <Logo>NAV<span>KAR</span></Logo>
        <p style={{ color: "#777", marginBottom: "2rem" }}>Centralized Administration Portal</p>
        <form onSubmit={handleSubmit}>
          <Input 
            type="email" 
            placeholder="Admin Email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
          <Input 
            type="password" 
            placeholder="Access Key" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
          />
          <LoginButton type="submit">Unlock Dashboard</LoginButton>
        </form>
        <p style={{ marginTop: "2rem", fontSize: "0.8rem", color: "#bbb" }}>
          Authorized Personnel Only. All activities logged.
        </p>
      </LoginCard>
    </LoginContainer>
  );
};

export default AdminLogin;
