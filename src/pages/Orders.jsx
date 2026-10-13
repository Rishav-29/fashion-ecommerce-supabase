import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function Orders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      if (!user) return;
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (
            quantity,
            price_at_purchase,
            products (
              name,
              image_url
            )
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        setOrders(data);
      }
      setLoading(false);
    }
    fetchOrders();
  }, [user]);

  if (loading) return <div className="container" style={{ margin: '8rem auto', textAlign: 'center' }}>Loading orders...</div>;

  return (
    <div className="container" style={{ margin: '8rem auto', padding: '0 1rem', maxWidth: '800px' }}>
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem' }}>Order History</h1>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet. <Link to="/" style={{ textDecoration: 'underline' }}>Start shopping</Link></p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {orders.map(order => (
            <div key={order.id} style={{ border: '1px solid var(--color-gray-200)', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--color-gray-200)', paddingBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Order ID</div>
                  <div style={{ fontSize: '0.9rem' }}>{order.id.slice(0, 8).toUpperCase()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Date</div>
                  <div style={{ fontSize: '0.9rem' }}>{new Date(order.created_at).toLocaleDateString()}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Status</div>
                  <div style={{ fontSize: '0.9rem', color: order.status === 'delivered' ? 'green' : 'var(--color-gold)', textTransform: 'capitalize' }}>
                    {order.status}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)', textTransform: 'uppercase' }}>Total</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 'bold' }}>${order.total_amount.toFixed(2)}</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {order.order_items.map(item => (
                  <div key={item.product_id} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <img src={item.products.image_url} alt={item.products.name} style={{ width: '60px', height: '80px', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{item.products.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-gray-500)' }}>Qty: {item.quantity}</div>
                    </div>
                    <div style={{ fontWeight: 'bold' }}>${item.price_at_purchase.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
