import { useEffect, useState } from "react";
import {
  FiSettings,
  FiLogOut,
  FiBox,
  FiMapPin,
  FiChevronRight,
  FiUser,
  FiPhone,
  FiPackage,
  FiMessageCircle,
} from "react-icons/fi";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import * as S from "../../styles/pages/account/styles";
import { getAllUserOrders } from "../../services/orderService";
import { deleteAddress, getAddresses, postAddress, updateAddress } from "../../services/addressService";
import { updateProfile } from "../../services/authService";
import { OrderResponse, Address } from "../../types/api";
import { AddressModal } from "../../components/AddressModal";
import { ConfirmationModal } from "../../components/ConfirmationModal";
import Link from "next/link";
import _ from "lodash";

const AccountPage = () => {
  const { data: session, update: updateSession } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("orders");
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    name: "",
    phone: "",
  });

  // Address Modal State
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (session) {
      setProfileForm({
        name: session.user.name || "",
        phone: session.user.phone || "",
      });
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [ordersRes, addressesRes] = await Promise.all([
        getAllUserOrders(),
        getAddresses(),
      ]);
      setOrders(ordersRes || []);
      setAddresses(addressesRes || []);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load account data.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProfile(profileForm);
      await updateSession();
      toast.success("Profile updated successfully.");
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  const onAddressSubmit = async (data: any) => {
    try {
      if (editingAddress) {
        await updateAddress({ ...data, addressId: editingAddress.id });
        toast.success("Address updated.");
      } else {
        await postAddress({ ...data, phone: profileForm.phone });
        toast.success("Address added.");
      }
      setShowAddressModal(false);
      setEditingAddress(null);
      fetchData();
    } catch (error) {
      toast.error("Failed to save address.");
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      const success = await deleteAddress(addressId);
      if (success) {
        toast.success("Address deleted.");
        fetchData();
      } else {
        toast.error("Failed to delete address.");
      }
    } catch (error: any) {
      const message = error.response?.data?.message || "An error occurred.";
      toast.error(message);
    } finally {
      setAddressToDelete(null);
    }
  };

  const openWhatsApp = (orderToken: string) => {
    const message = `Hi Navkar Team, I have an issue with my order #${orderToken}. Can you please help?`;
    window.open(`https://wa.me/91XXXXXXXXXX?text=${encodeURIComponent(message)}`, "_blank");
  };

  const mapAddressToData = (address: Address | null): any => {
    if (!address) return undefined;
    const [flatHouseNo, ...streetParts] = address.street.split("::");
    return {
      flatHouseNo: flatHouseNo || "",
      street: streetParts.join("::") || "",
      city: address.city,
      state: address.state,
      zip: address.postal_code,
      landmark: address.landmark,
      type: (address.type as any) || "Home",
    };
  };

  return (
    <S.ContentWrapper>
      <S.AccountContainer>
        <S.Sidebar>
          <S.UserCard>
            <S.UserName>{session?.user?.name || "User"}</S.UserName>
            <S.UserEmail>{session?.user?.email}</S.UserEmail>
          </S.UserCard>

          <S.NavMenu>
            <S.NavItem active={activeTab === "orders"} onClick={() => setActiveTab("orders")}>
              <FiBox /> <span>Orders</span> <FiChevronRight className="arrow" />
            </S.NavItem>
            <S.NavItem active={activeTab === "addresses"} onClick={() => setActiveTab("addresses")}>
              <FiMapPin /> <span>Addresses</span> <FiChevronRight className="arrow" />
            </S.NavItem>
            <S.NavItem active={activeTab === "settings"} onClick={() => setActiveTab("settings")}>
              <FiSettings /> <span>Settings</span> <FiChevronRight className="arrow" />
            </S.NavItem>
          </S.NavMenu>

          <S.LogoutButton onClick={handleLogout}>
            <FiLogOut /> <span>Sign Out</span>
          </S.LogoutButton>
        </S.Sidebar>

        <S.MainContent>
          {loading ? <p>Loading...</p> : (
            <>
              {activeTab === "orders" && (
                <S.Section>
                  <S.SectionTitle>Order History</S.SectionTitle>
                  {orders.length === 0 ? <p>No orders yet.</p> : (
                    <>
                      {/* Desktop Table */}
                      <S.OrdersTable>
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>Products</th>
                            <th>Total</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map((order) => (
                            <S.OrderRow key={order.id}>
                              <td><S.OrderId>#{order.order_token}</S.OrderId></td>
                              <td>
                                <S.ProductList>
                                  {order.order_items?.map((item, idx) => (
                                    <S.ProductItem key={idx}>
                                      <S.ProductImage src={item.image_url} alt={item.product_name} />
                                      <S.ProductName>
                                        <strong>{item.quantity}x</strong> {item.product_name}
                                      </S.ProductName>
                                    </S.ProductItem>
                                  ))}
                                </S.ProductList>
                              </td>
                              <td><S.Price>₹{Number(order.total_amount).toLocaleString("en-IN")}</S.Price></td>
                              <td>
                                <div style={{ display: "flex", gap: "0.5rem" }}>
                                  <S.ActionButton onClick={() => router.push(`/orders/${order.order_token}`)}>
                                    <FiPackage /> Track
                                  </S.ActionButton>
                                  <S.ActionButton className="support-btn" onClick={() => openWhatsApp(order.order_token)}>
                                    <FiMessageCircle /> Support
                                  </S.ActionButton>
                                </div>
                              </td>
                            </S.OrderRow>
                          ))}
                        </tbody>
                      </S.OrdersTable>

                      {/* Mobile Cards */}
                      <S.MobileOrdersList>
                        {orders.map((order) => (
                          <S.MobileOrderCard key={order.id}>
                            <div>
                              <S.MobileOrderToken>Order #{order.order_token}</S.MobileOrderToken>
                              <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem", marginTop: "0.25rem" }}>
                                <span style={{ fontSize: "0.75rem", color: "#999", textTransform: "uppercase", letterSpacing: "0.5px" }}>Total</span>
                                <S.MobileOrderDetail>₹{Number(order.total_amount).toLocaleString("en-IN")}</S.MobileOrderDetail>
                              </div>
                              <S.MobileProductList>
                                {order.order_items?.map((item, idx) => (
                                  <S.ProductItem key={idx}>
                                    <S.ProductImage src={item.image_url} alt={item.product_name} />
                                    <S.ProductName>
                                      <strong>{item.quantity}x</strong> {item.product_name}
                                    </S.ProductName>
                                  </S.ProductItem>
                                ))}
                              </S.MobileProductList>
                            </div>
                            <S.MobileOrderActions>
                              <S.ActionButton onClick={() => router.push(`/orders/${order.order_token}`)}>
                                <FiPackage /> Track
                              </S.ActionButton>
                              <S.ActionButton className="support-btn" onClick={() => openWhatsApp(order.order_token)}>
                                <FiMessageCircle /> Support
                              </S.ActionButton>
                            </S.MobileOrderActions>
                          </S.MobileOrderCard>
                        ))}
                      </S.MobileOrdersList>
                    </>
                  )}
                </S.Section>
              )}

              {activeTab === "addresses" && (
                <S.Section>
                  <S.SectionTitle>Saved Addresses</S.SectionTitle>
                  <S.AddressGrid>
                    {addresses.map((address) => (
                      <S.AddressCard key={address.id}>
                        <S.AddressName>{address.type || "Address"}</S.AddressName>
                        <S.AddressText>{address.street.replace("::", ", ")}, {address.city}, {address.state} - {address.postal_code}</S.AddressText>
                        <S.AddressActions>
                          <S.EditButton onClick={() => { setEditingAddress(address); setShowAddressModal(true); }}>Edit</S.EditButton>
                          <S.RemoveButton onClick={() => setAddressToDelete(address.id)}>Delete</S.RemoveButton>
                        </S.AddressActions>
                      </S.AddressCard>
                    ))}
                    <S.AddAddressCard onClick={() => { setEditingAddress(null); setShowAddressModal(true); }}>
                      <span>+ Add New Address</span>
                    </S.AddAddressCard>
                  </S.AddressGrid>
                </S.Section>
              )}

              {activeTab === "settings" && (
                <S.Section>
                  <S.SectionTitle>Profile & Trust Hub</S.SectionTitle>
                  <S.SettingsGrid>
                    <S.SettingsCard>
                      <h3><FiUser style={{ marginRight: "0.5rem" }} /> Profile Information</h3>
                      <S.SecurityForm onSubmit={handleUpdateProfile}>
                        <S.FormGroup>
                          <label>Full Name</label>
                          <S.Input value={profileForm.name} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileForm({...profileForm, name: e.target.value})} />
                        </S.FormGroup>
                        <S.FormGroup>
                          <label>Phone Number</label>
                          <S.Input value={profileForm.phone} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfileForm({...profileForm, phone: e.target.value})} />
                        </S.FormGroup>
                        <S.SaveButton type="submit">Save Changes</S.SaveButton>
                      </S.SecurityForm>
                    </S.SettingsCard>

                    <S.SettingsCard>
                      <h3>🛡️ Help & Trust Center</h3>
                      <p style={{ fontSize: "0.9rem", color: "#666", marginBottom: "1.5rem" }}>
                        Need help with your purchase? Check our policies or talk to us.
                      </p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <Link href="/returns" style={{ textDecoration: "none", color: "#333", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <FiChevronRight size={16} /> Returns & Refund Policy
                        </Link>
                        <Link href="/shipping" style={{ textDecoration: "none", color: "#333", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <FiChevronRight size={16} /> Shipping & Delivery Info
                        </Link>
                        <Link href="/faq" style={{ textDecoration: "none", color: "#333", display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <FiChevronRight size={16} /> Frequently Asked Questions
                        </Link>
                      </div>
                    </S.SettingsCard>
                  </S.SettingsGrid>
                </S.Section>
              )}
            </>
          )}
        </S.MainContent>
      </S.AccountContainer>

      {showAddressModal && (
        <AddressModal 
          isModalOpen={showAddressModal}
          setIsModalOpen={setShowAddressModal}
          title={editingAddress ? "Edit Address" : "Add New Address"}
          buttonText={editingAddress ? "Update Address" : "Add Address"}
          onButtonClick={onAddressSubmit}
          defaultValues={mapAddressToData(editingAddress)}
        />
      )}

      <ConfirmationModal
        isOpen={!!addressToDelete}
        onClose={() => setAddressToDelete(null)}
        onConfirm={() => addressToDelete && handleDeleteAddress(addressToDelete)}
        title="Delete Address"
        message="Are you sure you want to delete this address? This action cannot be undone."
        confirmText="Delete"
        variant="danger"
      />
    </S.ContentWrapper>
  );
};

export default AccountPage;
