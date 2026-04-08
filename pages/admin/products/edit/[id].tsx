import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "../../../../lib/axios";
import { AdminLayout } from "../../../../components/AdminLayout";
import { AdminProductEditor } from "../../../../components/AdminProductEditor";
import Head from "next/head";
import { Product } from "../../../../types/api";
import { Loader } from "../../../../components/Loader";

const EditProductPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      console.log(`[EditProduct] Fetching ID: ${id}`);
      axios.get(`/products/${id}`).then((res: any) => {
        console.log(`[EditProduct] Response:`, res.data);
        // Access nested product object from backend
        const p = res.data.product;
        setProduct(p);
        setLoading(false);
      }).catch((err: any) => {
        console.error(`[EditProduct] Error:`, err);
        setLoading(false);
      });
    }
  }, [id]);

  return (
    <>
      <Head>
        <title>Edit Product | Admin</title>
      </Head>
      <AdminLayout title="Manage Product & Variants">
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1rem" }}>
          {loading ? <Loader /> : product ? (
            <AdminProductEditor editProduct={product} />
          ) : (
            <p>Product not found.</p>
          )}
        </div>
      </AdminLayout>
    </>
  );
};

export default EditProductPage;
