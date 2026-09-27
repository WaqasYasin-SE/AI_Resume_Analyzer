
"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/app/providers";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function LogoutButton() {
  const { logout } = useAuth();

  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);

      await logout();

      window.location.href = "/login";
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setShowConfirm(true)}
        className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-bold bg-ink text-white hover:bg-ink/90 transition"
      >
        Log Out
        <LogOut size={14} />
      </button>

      <ConfirmModal
        open={showConfirm}
        title="Log Out"
        confirmText="Log Out"
        cancelText="Cancel"
        loading={loading}
        onConfirm={handleLogout}
        onCancel={() => setShowConfirm(false)}
      />
    </>
  );
}
