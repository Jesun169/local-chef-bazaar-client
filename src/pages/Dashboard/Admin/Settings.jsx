import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { motion } from "framer-motion";

const BASE_URL = "https://local-chef-bazaar-server-black.vercel.app";

const Settings = () => {
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState({
    siteName: "",
    supportEmail: "",
    maintenanceMode: false,
    commissionRate: 10,
    deliveryCharge: 0,
    emailNotifications: true,
    pushNotifications: true,
  });

  /* FETCH SETTINGS */
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch(`${BASE_URL}/settings`);
        const data = await res.json();
        setSettings(data);
      } catch (err) {
        toast.error("Failed to load settings");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  /* HANDLE CHANGE */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  /* SAVE SETTINGS */
  const handleSave = async () => {
    try {
      const res = await fetch(`${BASE_URL}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        toast.success("Settings updated successfully");
      } else {
        toast.error("Update failed");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p>Loading settings...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Toaster />

      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold">⚙ System Settings</h1>
        <p className="text-base-content/80">
          Control your platform configuration
        </p>
      </motion.div>

      {/* SETTINGS CARD */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-base-100/60 backdrop-blur-xl border rounded-2xl shadow-xl p-6 space-y-6"
      >

        {/* SITE INFO */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">Site Name</label>
            <input
              name="siteName"
              value={settings.siteName}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="Your platform name"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Support Email</label>
            <input
              name="supportEmail"
              value={settings.supportEmail}
              onChange={handleChange}
              className="input input-bordered w-full"
              placeholder="support@email.com"
            />
          </div>
        </div>

        {/* BUSINESS SETTINGS */}
        <div className="grid md:grid-cols-2 gap-4">

          <div>
            <label className="text-sm font-medium">
              Commission (%)
            </label>
            <input
              type="number"
              name="commissionRate"
              value={settings.commissionRate}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>

          <div>
            <label className="text-sm font-medium">
              Default Delivery Charge
            </label>
            <input
              type="number"
              name="deliveryCharge"
              value={settings.deliveryCharge}
              onChange={handleChange}
              className="input input-bordered w-full"
            />
          </div>
        </div>

        {/* TOGGLES */}
        <div className="space-y-4">

          {/* MAINTENANCE MODE */}
          <div className="flex items-center justify-between bg-base-200 p-4 rounded-xl">
            <div>
              <h3 className="font-semibold">Maintenance Mode</h3>
              <p className="text-sm text-base-content/80">
                Disable site access for users
              </p>
            </div>

            <input
              type="checkbox"
              name="maintenanceMode"
              checked={settings.maintenanceMode}
              onChange={handleChange}
              className="toggle toggle-error"
            />
          </div>

          {/* EMAIL NOTIFICATIONS */}
          <div className="flex items-center justify-between bg-base-200 p-4 rounded-xl">
            <div>
              <h3 className="font-semibold">Email Notifications</h3>
              <p className="text-sm text-base-content/80">
                Receive system emails
              </p>
            </div>

            <input
              type="checkbox"
              name="emailNotifications"
              checked={settings.emailNotifications}
              onChange={handleChange}
              className="toggle toggle-primary"
            />
          </div>

          {/* PUSH NOTIFICATIONS */}
          <div className="flex items-center justify-between bg-base-200 p-4 rounded-xl">
            <div>
              <h3 className="font-semibold">Push Notifications</h3>
              <p className="text-sm text-base-content/80">
                App notifications for admins
              </p>
            </div>

            <input
              type="checkbox"
              name="pushNotifications"
              checked={settings.pushNotifications}
              onChange={handleChange}
              className="toggle toggle-success"
            />
          </div>
        </div>

        {/* SAVE BUTTON */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="btn btn-primary w-full"
        >
          Save Settings
        </motion.button>
      </motion.div>
    </div>
  );
};

export default Settings;