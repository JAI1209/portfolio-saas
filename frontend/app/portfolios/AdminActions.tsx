"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type SessionUser = {
  role?: string;
};

export default function AdminActions() {
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch("/api/auth/me", { credentials: "include" })
      .then(async (res) => {
        if (!res.ok) {
          return null;
        }
        const data = (await res.json()) as { user?: SessionUser };
        return data?.user?.role || null;
      })
      .then((nextRole) => {
        if (mounted) {
          setRole(nextRole);
        }
      })
      .catch(() => {
        if (mounted) {
          setRole(null);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  if (loading) {
    return (
      <div className="rounded-full border border-white/10 px-4 py-2 text-sm text-slate-400">
        Checking session...
      </div>
    );
  }

  if (role) {
    const href = role === "admin" ? "/admin/portfolios" : "/dashboard";
    return (
      <Link
        className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:border-white/30 hover:bg-white/10"
        href={href}
      >
        Create Portfolio
      </Link>
    );
  }

  return (
    <Link
      className="rounded-full border border-white/15 px-4 py-2 text-sm text-white transition hover:border-white/30 hover:bg-white/10"
      href="/login"
    >
      Admin Login
    </Link>
  );
}
