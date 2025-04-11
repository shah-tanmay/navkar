import { useState } from "react";
import {
  FiSettings,
  FiLogOut,
  FiBox,
  FiMapPin,
  FiLock,
  FiChevronRight,
} from "react-icons/fi";
import * as S from "./styles";

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState("orders");
  const [orders] = useState([
    {
      id: "#VH2837",
      date: "2024-03-15",
      status: "Delivered",
      items: 2,
      total: "₹4,800",
    },
    {
      id: "#VH1982",
      date: "2024-02-28",
      status: "Processing",
      items: 1,
      total: "₹2,400",
    },
  ]);

  const [addresses] = useState([
    { name: "Home", address: "24 Crescent Road, Bangalore, 560001" },
    { name: "Office", address: "Tech Park Tower, Hyderabad, 500081" },
  ]);

  return (
    <S.ContentWrapper>
      <S.AccountContainer>
        <S.Sidebar>
          <S.UserCard>
            <S.UserName>Arjun Patel</S.UserName>
            <S.UserEmail>arjun@velvethaven.com</S.UserEmail>
          </S.UserCard>

          <S.NavMenu>
            <S.NavItem
              active={activeTab === "orders"}
              onClick={() => setActiveTab("orders")}
            >
              <FiBox />
              <span>Orders</span>
              <FiChevronRight className="arrow" />
            </S.NavItem>
            <S.NavItem
              active={activeTab === "addresses"}
              onClick={() => setActiveTab("addresses")}
            >
              <FiMapPin />
              <span>Addresses</span>
              <FiChevronRight className="arrow" />
            </S.NavItem>
            <S.NavItem
              active={activeTab === "security"}
              onClick={() => setActiveTab("security")}
            >
              <FiLock />
              <span>Security</span>
              <FiChevronRight className="arrow" />
            </S.NavItem>
            <S.NavItem
              active={activeTab === "settings"}
              onClick={() => setActiveTab("settings")}
            >
              <FiSettings />
              <span>Settings</span>
              <FiChevronRight className="arrow" />
            </S.NavItem>
          </S.NavMenu>

          <S.LogoutButton>
            <FiLogOut />
            <span>Sign Out</span>
          </S.LogoutButton>
        </S.Sidebar>

        <S.MainContent>
          {/* Orders Tab */}
          {activeTab === "orders" && (
            <S.Section>
              <S.SectionTitle>Order History</S.SectionTitle>

              {/* Desktop Table */}
              <S.OrdersTable>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Items</th>
                    <th>Status</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <S.OrderRow key={order.id}>
                      <td>
                        <S.OrderId>{order.id}</S.OrderId>
                      </td>
                      <td>{order.date}</td>
                      <td>{order.items} items</td>
                      <td>
                        <S.StatusBadge status={order.status}>
                          {order.status}
                        </S.StatusBadge>
                      </td>
                      <td>
                        <S.Price>{order.total}</S.Price>
                      </td>
                    </S.OrderRow>
                  ))}
                </tbody>
              </S.OrdersTable>

              {/* Mobile List */}
              <S.MobileOrdersList>
                {orders.map((order) => (
                  <S.MobileOrderCard key={order.id}>
                    <div>
                      <S.OrderId>{order.id}</S.OrderId>
                      <S.MobileOrderDetail>
                        Date: {order.date}
                      </S.MobileOrderDetail>
                      <S.MobileOrderDetail>
                        Items: {order.items}
                      </S.MobileOrderDetail>
                      <S.StatusBadge status={order.status}>
                        {order.status}
                      </S.StatusBadge>
                    </div>
                    <S.Price>{order.total}</S.Price>
                  </S.MobileOrderCard>
                ))}
              </S.MobileOrdersList>
            </S.Section>
          )}

          {/* Addresses Tab */}
          {activeTab === "addresses" && (
            <S.Section>
              <S.SectionTitle>Saved Addresses</S.SectionTitle>
              <S.AddressGrid>
                {addresses.map((address) => (
                  <S.AddressCard key={address.name}>
                    <S.AddressName>{address.name}</S.AddressName>
                    <S.AddressText>{address.address}</S.AddressText>
                    <S.AddressActions>
                      <S.EditButton>Edit</S.EditButton>
                      <S.RemoveButton>Remove</S.RemoveButton>
                    </S.AddressActions>
                  </S.AddressCard>
                ))}
                <S.AddAddressCard>
                  <span>+ Add New Address</span>
                </S.AddAddressCard>
              </S.AddressGrid>
            </S.Section>
          )}

          {/* Security Tab */}
          {activeTab === "security" && (
            <S.Section>
              <S.SectionTitle>Security Settings</S.SectionTitle>
              <S.SecurityForm>
                <S.FormGroup>
                  <label>Current Password</label>
                  <S.Input type="password" placeholder="••••••••" />
                </S.FormGroup>
                <S.FormGroup>
                  <label>New Password</label>
                  <S.Input type="password" placeholder="••••••••" />
                </S.FormGroup>
                <S.FormGroup>
                  <label>Confirm Password</label>
                  <S.Input type="password" placeholder="••••••••" />
                </S.FormGroup>
                <S.SaveButton>Update Password</S.SaveButton>
              </S.SecurityForm>
            </S.Section>
          )}
        </S.MainContent>
      </S.AccountContainer>

      <S.Footer>
        <p>&copy; {new Date().getFullYear()} VelvetHaven</p>
        <p>Premium Home Textiles & Lifestyle</p>
      </S.Footer>
    </S.ContentWrapper>
  );
};

export default AccountPage;
