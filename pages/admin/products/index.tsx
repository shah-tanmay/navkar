import { NextPage } from "next";
import { AdminLayout } from "../../../components/AdminLayout";
import { Card } from "../../../components/AdminLayout/styles";
import Head from "next/head";
import { useEffect, useState } from "react";
import axios from "../../../lib/axios";
import { Product } from "../../../types/api";
import styled from "styled-components";
import COLORS from "../../../constants/color";
import { useRouter } from "next/router";

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const AddButton = styled.button`
  background: ${COLORS.gold};
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background: ${COLORS.secondary};
    transform: translateY(-2px);
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    padding: 1rem;
    text-align: left;
    border-bottom: 2px solid ${COLORS.accent};
    color: ${COLORS.secondary};
    font-weight: 600;
  }

  td {
    padding: 1rem;
    border-bottom: 1px solid ${COLORS.accent};
    color: #555;
    vertical-align: middle;
  }

  tr:hover {
    background: rgba(212, 175, 55, 0.05);
  }
`;

const ProductImage = styled.img`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 8px;
  background: #f0f0f0;
`;

const ActionButton = styled.button<{ $danger?: boolean }>`
  background: transparent;
  border: 1px solid ${(props) => (props.$danger ? "#ff4d4f" : COLORS.gold)};
  color: ${(props) => (props.$danger ? "#ff4d4f" : COLORS.secondary)};
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  margin-right: 0.5rem;
  transition: all 0.2s;

  &:hover {
    background: ${(props) => (props.$danger ? "#ff4d4f" : COLORS.gold)};
    color: white;
  }
`;

const StatusBadge = styled.span<{ $discontinued?: boolean }>`
  padding: 0.2rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.$discontinued ? '#fff1f0' : '#f6ffed'};
  color: ${props => props.$discontinued ? '#cf1322' : '#389e0d'};
  border: 1px solid ${props => props.$discontinued ? '#ffa39e' : '#b7eb8f'};
`;

const AdminProducts: NextPage = () => {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    setLoading(true);
    axios.get("/products", { params: { adminView: true } }).then((res: any) => {
      const rawProducts = res.data.products || [];
      const mappedProducts = rawProducts.map((p: any) => ({
        ...p,
        real_id: p.product_id || p.id,
        id: (p.variants && p.variants[0] ? p.variants[0].slug : p.product_id) || p.product_id || p.id,
        name: p.product_name || p.name,
        price: p.price || (p.variants && p.variants[0] ? p.variants[0].price : 0),
        stock: p.stock || 0,
        image_url: p.image_url || (p.variants && p.variants[0] ? p.variants[0].image_url : null),
        is_discontinued: p.is_discontinued,
      }));
      setProducts(mappedProducts);
      setLoading(false);
    }).catch(e => setLoading(false));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleEdit = (product: Product) => {
    router.push(`/admin/products/edit/${product.id}`);
  };

  const handleAddNew = () => {
    router.push("/admin/products/add");
  };

  const handleToggleDiscontinued = async (product: any) => {
    try {
      const pId = product.product_id || product.real_id || product.id;
      await axios.put(`/products/${pId}`, { is_discontinued: !product.is_discontinued });
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await axios.delete(`/products/${id}`);
      fetchProducts();
    } catch(err) {
      console.error(err);
      alert("Failed to delete product");
    }
  };

  return (
    <>
      <Head>
        <title>Manage Products | Admin</title>
      </Head>
      <AdminLayout title="Manage Products">
        
        <TopBar>
          <p style={{ color: "#777" }}>Showing {products.length} catalog items</p>
          <AddButton onClick={handleAddNew}>+ Add Product</AddButton>
        </TopBar>

        <Card>
          {loading ? <p>Loading product catalog...</p> : (
            <StyledTable>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Base Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>
                      {p.image_url ? (
                        <ProductImage src={p.image_url} alt={p.name} />
                      ) : (
                        <div style={{ width: 48, height: 48, background: '#eee', borderRadius: 8 }} />
                      )}
                    </td>
                    <td style={{ fontWeight: 500, color: COLORS.secondary }}>{p.name}</td>
                    <td>₹{p.price}</td>
                    <td>{p.stock} units</td>
                    <td>
                      <StatusBadge $discontinued={p.is_discontinued}>
                        {p.is_discontinued ? "Discontinued" : "Active"}
                      </StatusBadge>
                    </td>
                    <td>
                      <ActionButton onClick={() => handleEdit(p)}>Edit</ActionButton>
                      <ActionButton 
                        $danger={!p.is_discontinued} 
                        onClick={() => handleToggleDiscontinued(p)}
                      >
                        {p.is_discontinued ? "Activate" : "Discontinue"}
                      </ActionButton>
                      <ActionButton $danger onClick={() => handleDelete(p.product_id || (p as any).real_id || p.id)}>Delete</ActionButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </StyledTable>
          )}
        </Card>

      </AdminLayout>
    </>
  );
};

export default AdminProducts;
