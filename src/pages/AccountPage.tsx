import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Package,
  MapPin,
  Bell,
  Lock,
  LogOut,
  Loader2,
  Trash2,
  Star,
  RotateCcw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import {
  useProfile,
  useUpdateProfile,
  useAddresses,
  useAddAddress,
  useDeleteAddress,
  useSetDefaultAddress,
  useNotifications,
  useMarkAllRead,
  useUpdateNotificationPrefs,
  useDeleteAccount,
} from "@/hooks/useApi";
import { formatPrice } from "@/utils/helpers";
import { toast } from "sonner";
import type { Order, Address, Notification } from "@/types";
import OrdersTab from "@/components/account/OrdersTab";
import { disconnectSocket } from "@/hooks/useSocket";
import AddressesTab from "@/components/account/Addressestab";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "orders", label: "My Orders", icon: Package },
  { id: "addresses", label: "Addresses", icon: MapPin },
  { id: "notifications", label: "Notifications", icon: Bell },
  // { id: 'password', label: 'Change Password', icon: Lock },
];

const AccountPage = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    disconnectSocket();
    toast.success("Logged out successfully");
    navigate("/");
  };

  if (!user) {
    navigate("/login?redirect=/account");
    return null;
  }

  return (
    <main className="pt-20 section-padding">
      <div className="container-wide">
        <h1 className="text-3xl font-display font-bold text-foreground mb-8">
          My Account
        </h1>

        <div className="grid lg:grid-cols-4 gap-8">
          <nav className="lg:col-span-1">
            <div className="bg-card rounded-2xl border border-border p-2 shadow-[var(--shadow-card)]">
              <div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-x-visible">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
                <Separator className="my-1 hidden lg:block" />
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors whitespace-nowrap"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            </div>
          </nav>

          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-2xl border border-border p-6 md:p-8 shadow-[var(--shadow-card)]"
            >
              {activeTab === "profile" && <ProfileTab user={user} />}
              {activeTab === "orders" && <OrdersTab />}
              {activeTab === "addresses" && <AddressesTab />}
              {activeTab === "notifications" && <NotificationsTab />}
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
  const [firstName, setFirstName] = useState(userData.firstName || "");
  const [lastName, setLastName] = useState(userData.lastName || "");
  const [phone, setPhone] = useState(userData.phone || "");

  const handleSave = async () => {
    try {
      await updateProfile.mutateAsync({ firstName, lastName, phone });
      setUser({ ...userData, firstName, lastName, phone });
      toast.success("Profile updated!");
    } catch {
      toast.error("Failed to update profile");
    }
  };

  const handleDeleteAccount = async () => {
    const password = prompt("Enter your password to confirm account deletion:");
    if (!password) return;
    try {
      await deleteAccount.mutateAsync(password);
      useAuthStore.getState().logout();
      toast.success("Account deleted");
    } catch {
      toast.error("Failed to delete account");
    }
  };

  return (
    <div>
      <h2 className="text-xl font-display font-bold text-foreground mb-6">
        Profile Information
      </h2>
      <div className="flex items-center gap-4 mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display text-xl font-bold">
          {userData.firstName?.[0]}
          {userData.lastName?.[0]}
        </div>
        <div>
          <p className="font-semibold text-foreground">
            {userData.firstName} {userData.lastName}
          </p>
          <p className="text-sm text-muted-foreground">{userData.email}</p>
        </div>
      </div>
      <div className="space-y-4 max-w-md">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>First Name</Label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Last Name</Label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={userData.email} disabled />
        </div>
        <div className="space-y-2">
          <Label>Phone</Label>
          <Input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+234..."
          />
        </div>
        <div className="flex gap-3">
          <Button onClick={handleSave} disabled={updateProfile.isPending}>
            {updateProfile.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin mr-2" />
            ) : null}{" "}
            Save Changes
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDeleteAccount}>
            Delete Account
          </Button>
        </div>
      </div>
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
      toast.success("Preferences saved!");
    } catch {
      toast.error("Failed to save preferences");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-display font-bold text-foreground">
          Notifications
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            markAllRead
              .mutateAsync()
              .then(() => toast.success("All marked as read"))
          }
        >
          Mark All Read
        </Button>
      </div>

      {/* Notification List */}
      {data?.notifications && data.notifications.length > 0 ? (
        <div className="space-y-2 mb-8">
          {data.notifications.map((n: Notification) => (
            <div
              key={n.id}
              className={`p-4 rounded-xl border ${n.isRead ? "border-border bg-card" : "border-primary/20 bg-primary/5"}`}
            >
              <p className="font-medium text-foreground text-sm">{n.title}</p>
              <p className="text-xs text-muted-foreground">{n.message}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {new Date(n.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-muted-foreground text-sm mb-8">
          No notifications yet.
        </p>
      )}

      <Separator className="my-6" />
      <h3 className="font-display font-semibold text-foreground mb-4">
        Preferences
      </h3>
      <div className="space-y-4 max-w-md">
        <div className="flex items-center justify-between">
          <Label>Email notifications</Label>
          <Switch checked={email} onCheckedChange={setEmail} />
        </div>
        {/* <div className="flex items-center justify-between"><Label>SMS notifications</Label><Switch checked={sms} onCheckedChange={setSms} /></div> */}
        {/* <div className="flex items-center justify-between"><Label>Push notifications</Label><Switch checked={push} onCheckedChange={setPush} /></div> */}
        <div className="flex items-center justify-between">
          <Label>In-app notifications</Label>
          <Switch checked={inApp} onCheckedChange={setInApp} />
        </div>
        <Button onClick={handleSavePrefs} disabled={updatePrefs.isPending}>
          Save Preferences
        </Button>
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
