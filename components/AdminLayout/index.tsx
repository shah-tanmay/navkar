import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { Loader } from "../Loader";
import * as S from "./styles";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?redirect=${encodeURIComponent(router.asPath)}`);
    } else if (status === "authenticated") {
      if (session?.user?.role !== "admin") {
        toast.error("Unauthorized: Admin access required.");
        router.push("/");
      }
    }
  }, [status, session, router]);

  if (status === "loading" || session?.user?.role !== "admin") {
    return <Loader />;
  }


  const navItems = [
    { label: "Revenue Analytics", path: "/admin/dashboard" },
    { label: "Orders Management", path: "/admin/orders" },
    { label: "Products & Catalogue", path: "/admin/products" },
    { label: "Inventory Tracker", path: "/admin/inventory" },
    { label: "Customer Database", path: "/admin/customers" },
    { label: "Abandoned Carts", path: "/admin/abandoned-carts" },
    { label: "Discount Coupons", path: "/admin/coupons" },
    { label: "Pincode Service", path: "/admin/pincodes" },
    { label: "Ad Performance", path: "/admin/ad-performance" },
    { label: "Site Settings", path: "/admin/settings" },
    { label: "Storefront Home", path: "/" },
  ];

  return (
    <S.AdminContainer>
      <S.Sidebar>
        <div style={{ fontSize: "1.5rem", fontWeight: "bold", padding: "0 1rem 1rem", borderBottom: "1px solid #334155" }}>
          Admin Panel
        </div>
        {navItems.map((item) => (
          <S.SidebarLink
            key={item.path}
            $active={router.pathname === item.path}
            onClick={() => router.push(item.path)}
          >
            {item.label}
          </S.SidebarLink>
        ))}
      </S.Sidebar>
      <S.MainContent>
        {title && (
          <S.PageHeader>
            <h1>{title}</h1>
          </S.PageHeader>
        )}
        {children}
      </S.MainContent>
    </S.AdminContainer>
  );
};
