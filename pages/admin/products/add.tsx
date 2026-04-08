import { NextPage } from "next";
import { AdminLayout } from "../../../components/AdminLayout";
import { AdminProductEditor } from "../../../components/AdminProductEditor";
import Head from "next/head";

const AddProductPage: NextPage = () => {
  return (
    <>
      <Head>
        <title>Add New Product | Admin</title>
      </Head>
      <AdminLayout title="Create Product Anchor">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          <p style={{ color: "#64748b", marginBottom: "2rem" }}>
            Start by creating the global product identity. Once saved, you can add specific color variants.
          </p>
          <AdminProductEditor />
        </div>
      </AdminLayout>
    </>
  );
};

export default AddProductPage;
