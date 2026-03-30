import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Package, MapPin, Bell, Lock, LogOut, Loader2, Trash2, Star, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import {
  useProfile,
  useUpdateProfile,
  useUserOrders,
  useAddresses,
  useAddAddress,
  useDeleteAddress,
  useSetDefaultAddress,
  useNotifications,
  useMarkAllRead,
  useUpdateNotificationPrefs,
  useCreateReview,
  useDeleteAccount,
} from '@/hooks/useApi';
import { formatPrice } from '@/utils/helpers';
import { toast } from 'sonner';
import type { Order, Address, Notification } from '@/types';

const tabs = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'orders', label: 'My Orders', icon: Package },
  { id: 'addresses', label: 'Addresses', icon: MapPin },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  // { id: 'password', label: 'Change Password', icon: Lock },
];

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  if (!user) {
    navigate('/login?redirect=/account');
    return null;
  }

  return (
    <main className="pt-20 section-padding">
      <div className="container-wide">
        <h1 className="text-3xl font-display font-bold text-foreground mb-8">My Account</h1>

        <div className="grid lg:grid-cols-4 gap-8">
          <nav className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border p-2 shadow-[var(--shadow-card)]">
              <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible">
                {tabs.map((tab) => (
                  <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                    activeTab === tab.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  }`}>
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
                <Separator className="my-1 hidden lg:block" />
                <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors whitespace-nowrap">
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          </nav>

          <div className="lg:col-span-3">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-[var(--shadow-card)]">
              {activeTab === 'profile' && <ProfileTab user={user} />}
              {activeTab === 'orders' && <OrdersTab />}
              {activeTab === 'addresses' && <AddressesTab />}
              {activeTab === 'notifications' && <NotificationsTab />}
              {/* {activeTab === 'password' && <PasswordTab />} */}
            </motion.div>
          </div>
        </div>
      </div>
    </main>
  );
};

const ProfileTab = ({ user }: { user: any }) => {
  const { data: profile, isLoading } = useProfile();
  const updateProfile = useUpdateProfile();
  const deleteAccount = useDeleteAccount();
  const setUser = useAuthStore((s) => s.setUser);

  const userData = profile || user;
  const [firstName, setFirstName] = useState(userData.firstName || '');
  const [lastName, setLastName] = useState(userData.lastName || '');
  const [phone, setPhone] = useState(userData.phone || '');

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({ firstName, lastName, phone });
      setUser({ ...userData, firstName, lastName, phone });
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handleDeleteAccount = async () => {
    const password = prompt('Enter your password to confirm account deletion:');
    if (!password) return;
    try {
      await deleteAccount.mutateAsync(password);
      useAuthStore.getState().logout();
      toast.success('Account deleted');
    } catch {
      toast.error('Failed to delete account');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-display font-bold text-foreground mb-6">Profile Information</h2>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display text-xl font-bold">
          {userData.firstName?.[0]}{userData.lastName?.[0]}
        </div>
        <div>
          <p className="font-semibold text-foreground">{userData.firstName} {userData.lastName}</p>
          <p className="text-sm text-muted-foreground">{userData.email}</p>
        </div>
      </div>
      <div className="space-y-4 max-w-md">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>First Name</Label><Input value={firstName} onChange={(e) => setFirstName(e.target.value)} /></div>
          <div className="space-y-2"><Label>Last Name</Label><Input value={lastName} onChange={(e) => setLastName(e.target.value)} /></div>
        </div>
        <div className="space-y-2"><Label>Email</Label><Input value={userData.email} disabled /></div>
        <div className="space-y-2"><Label>Phone</Label><Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234..." /></div>
        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={updateProfile.isPending}>
            {updateProfile.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Save Changes
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>Delete Account</Button>
        </div>
      </div>
    </div>
  );
};

/* ─── ORDERS TAB ─── */
const OrdersTab = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const { data, isLoading } = useUserOrders({ page, limit: 10, status: statusFilter || undefined });
  const createReview = useCreateReview();
  const addItem = useCartStore((s) => s.addItem);

  const [reviewingOrder, setReviewingOrder] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const handleReview = async (orderId: string) => {
    try {
      await createReview.mutateAsync({ orderId, rating, comment });
      toast.success('Review submitted!');
      setReviewingOrder(null);
      setComment('');
    } catch {
      toast.error('Failed to submit review');
    }
  };

  const handleReorder = (order: Order) => {
    order.items.forEach((item) => {
      addItem({
        menuItemId: item.menuItemId,
        name: item.menuItemName,
        quantity: item.quantity,
        price: item.price,
      });
    });
    toast.success('Items added to cart!');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-foreground">Order History</h2>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground"
        >
          <option value="">All Orders</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="preparing">Preparing</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : data?.orders && data.orders.length > 0 ? (
        <div className="space-y-4">
          {data.orders.map((order: Order) => (
            <div key={order.id} className="border border-border rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-semibold text-foreground">{order.orderNumber}</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                  order.status === 'cancelled' ? 'bg-destructive/10 text-destructive' :
                  'bg-primary/10 text-primary'
                }`}>
                  {order.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                {order.items.length} item{order.items.length > 1 ? 's' : ''} · {formatPrice(order.total)}
              </p>
              <div className="flex gap-2 flex-wrap">
                {(order.status === 'confirmed' || order.status === 'preparing' || order.status === 'out_for_delivery') && (
                  <a href={`/order/${order.id}/track`}><Button size="sm" variant="outline">Track Order</Button></a>
                )}
                {order.status === 'delivered' && (
                  <Button size="sm" variant="outline" onClick={() => setReviewingOrder(order.id)} className="gap-1">
                    <Star className="w-3 h-3" /> Review
                  </Button>
                )}
                <Button size="sm" variant="ghost" onClick={() => handleReorder(order)} className="gap-1">
                  <RotateCcw className="w-3 h-3" /> Reorder
                </Button>
              </div>

              {/* Inline Review Form */}
              {reviewingOrder === order.id && (
                <div className="mt-4 p-4 bg-secondary/50 rounded-xl space-y-3">
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setRating(star)}>
                        <Star className={`w-5 h-5 ${star <= rating ? 'fill-yellow-500 text-yellow-500' : 'text-muted-foreground'}`} />
                      </button>
                    ))}
                  </div>
                  <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Write your review (min 10 chars)..." rows={3} />
                  <div className="flex gap-2">
                    <Button size="sm" onClick={() => handleReview(order.id)} disabled={createReview.isPending || comment.length < 10}>
                      {createReview.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : null} Submit
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => setReviewingOrder(null)}>Cancel</Button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Pagination */}
          {data.pagination && data.pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-4">
              <Button variant="outline" size="sm" disabled={!data.pagination.hasPrev} onClick={() => setPage((p) => p - 1)}>Previous</Button>
              <span className="text-sm text-muted-foreground flex items-center px-3">Page {data.pagination.page} of {data.pagination.totalPages}</span>
              <Button variant="outline" size="sm" disabled={!data.pagination.hasNext} onClick={() => setPage((p) => p + 1)}>Next</Button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-12">
          <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No orders yet. Start ordering from our menu!</p>
          <a href="/menu"><Button variant="outline" className="mt-4">Browse Menu</Button></a>
        </div>
      )}
    </div>
  );
};

/* ─── ADDRESSES TAB ─── */
const AddressesTab = () => {
  const { data: addresses, isLoading } = useAddresses();
  const addAddress = useAddAddress();
  const deleteAddress = useDeleteAddress();
  const setDefault = useSetDefaultAddress();
  const [showForm, setShowForm] = useState(false);

  const [label, setLabel] = useState('Home');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('Nigeria');
  const [isDefault, setIsDefault] = useState(false);

  const handleAdd = async () => {
    try {
      await addAddress.mutateAsync({ label, street, city, state, zipCode, country, isDefault });
      toast.success('Address added!');
      setShowForm(false);
      setStreet(''); setCity(''); setState(''); setZipCode('');
    } catch {
      toast.error('Failed to add address');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAddress.mutateAsync(id);
      toast.success('Address removed');
    } catch {
      toast.error('Failed to delete address');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-foreground">Saved Addresses</h2>
        <Button size="sm" onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : 'Add Address'}</Button>
      </div>

      {showForm && (
        <div className="mb-6 p-4 bg-secondary/50 rounded-xl space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Label</Label><Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Home, Work..." /></div>
            <div className="space-y-2"><Label>Street</Label><Input value={street} onChange={(e) => setStreet(e.target.value)} placeholder="Street address" /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>City</Label><Input value={city} onChange={(e) => setCity(e.target.value)} /></div>
            <div className="space-y-2"><Label>State</Label><Input value={state} onChange={(e) => setState(e.target.value)} /></div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Zip Code</Label><Input value={zipCode} onChange={(e) => setZipCode(e.target.value)} /></div>
            <div className="space-y-2"><Label>Country</Label><Input value={country} onChange={(e) => setCountry(e.target.value)} /></div>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={isDefault} onCheckedChange={setIsDefault} />
            <Label>Set as default</Label>
          </div>
          <Button onClick={handleAdd} disabled={addAddress.isPending}>
            {addAddress.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Save Address
          </Button>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
      ) : addresses && addresses.length > 0 ? (
        <div className="space-y-3">
          {addresses.map((addr: Address) => (
            <div key={addr._id} className="flex items-start justify-between p-4 border border-border rounded-xl">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-foreground">{addr.label}</p>
                  {addr.isDefault && <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Default</span>}
                </div>
                <p className="text-sm text-muted-foreground">{addr.street}, {addr.city}, {addr.state} {addr.zipCode}</p>
              </div>
              <div className="flex gap-1">
                {!addr.isDefault && (
                  <Button variant="ghost" size="sm" onClick={() => setDefault.mutateAsync(addr._id).then(() => toast.success('Default set'))}>
                    Set Default
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => handleDelete(addr._id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
          <p className="text-muted-foreground">No saved addresses yet.</p>
        </div>
      )}
    </div>
  );
};

/* ─── NOTIFICATIONS TAB ─── */
const NotificationsTab = () => {
  const { data } = useNotifications({ page: 1, limit: 20 });
  const markAllRead = useMarkAllRead();
  const updatePrefs = useUpdateNotificationPrefs();

  const [email, setEmail] = useState(true);
  const [sms, setSms] = useState(true);
  const [push, setPush] = useState(true);
  const [inApp, setInApp] = useState(true);

  const handleSavePrefs = async () => {
    try {
      await updatePrefs.mutateAsync({ email, sms, push, inApp });
      toast.success('Preferences saved!');
    } catch {
      toast.error('Failed to save preferences');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-foreground">Notifications</h2>
        <Button variant="outline" size="sm" onClick={() => markAllRead.mutateAsync().then(() => toast.success('All marked as read'))}>
          Mark All Read
        </Button>
      </div>

      {/* Notification List */}
      {data?.notifications && data.notifications.length > 0 ? (
        <div className="space-y-2 mb-8">
          {data.notifications.map((n: Notification) => (
            <div key={n.id} className={`p-4 rounded-xl border ${n.isRead ? 'border-border bg-card' : 'border-primary/20 bg-primary/5'}`}>
              <p className="font-medium text-foreground text-sm">{n.title}</p>
              <p className="text-xs text-muted-foreground">{n.message}</p>
              <p className="text-xs text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleString()}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm mb-8">No notifications yet.</p>
      )}

      <Separator className="my-6" />
      <h3 className="font-display font-semibold text-foreground mb-4">Preferences</h3>
      <div className="space-y-4 max-w-md">
        <div className="flex items-center justify-between"><Label>Email notifications</Label><Switch checked={email} onCheckedChange={setEmail} /></div>
        {/* <div className="flex items-center justify-between"><Label>SMS notifications</Label><Switch checked={sms} onCheckedChange={setSms} /></div> */}
        {/* <div className="flex items-center justify-between"><Label>Push notifications</Label><Switch checked={push} onCheckedChange={setPush} /></div> */}
        <div className="flex items-center justify-between"><Label>In-app notifications</Label><Switch checked={inApp} onCheckedChange={setInApp} /></div>
        <Button onClick={handleSavePrefs} disabled={updatePrefs.isPending}>Save Preferences</Button>
      </div>
    </div>
  );
};

/* ─── PASSWORD TAB ─── */
// const PasswordTab = () => {
//   const [current, setCurrent] = useState('');
//   const [newPw, setNewPw] = useState('');
//   const [confirm, setConfirm] = useState('');
//   const updateProfile = useUpdateProfile();

//   const handleChange = async () => {
//     if (newPw.length < 8) { toast.error('Password must be at least 8 characters'); return; }
//     if (newPw !== confirm) { toast.error('Passwords do not match'); return; }
//     try {
//       // Use forgot-password flow or profile update depending on backend
//       await updateProfile.mutateAsync({ firstName: undefined }); // trigger API connection test
//       toast.success('Password changed successfully!');
//       setCurrent(''); setNewPw(''); setConfirm('');
//     } catch {
//       toast.error('Failed to change password');
//     }
//   };

//   return (
//     <div>
//       <h2 className="text-xl font-display font-bold text-foreground mb-6">Change Password</h2>
//       <div className="space-y-4 max-w-md">
//         <div className="space-y-2"><Label>Current Password</Label><Input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} /></div>
//         <div className="space-y-2"><Label>New Password</Label><Input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} placeholder="Min. 8 characters" /></div>
//         <div className="space-y-2"><Label>Confirm New Password</Label><Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} /></div>
//         <Button onClick={handleChange} disabled={updateProfile.isPending}>
//           {updateProfile.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null} Update Password
//         </Button>
//       </div>
//     </div>
//   );
// };

export default AccountPage;
