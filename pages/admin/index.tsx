import { NextPage } from "next";
import { AdminLayout } from "../../components/AdminLayout";
import { Card } from "../../components/AdminLayout/styles";
import Head from "next/head";

const AdminDashboard: NextPage = () => {
  return (
    <>
      <Head>
        <title>Admin Dashboard | Navkar</title>
      </Head>
      <AdminLayout title="Dashboard Overview">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          <Card>
            <h3 style={{ margin: "0 0 1rem" }}>Total Revenue</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>₹0.00</p>
          </Card>
          <Card>
            <h3 style={{ margin: "0 0 1rem" }}>Orders</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>0</p>
          </Card>
          <Card>
            <h3 style={{ margin: "0 0 1rem" }}>Products</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", margin: 0 }}>Manage Library...</p>
          </Card>
        </div>
      </AdminLayout>
    </>
  );
};

export default AdminDashboard;
