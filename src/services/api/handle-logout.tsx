import { signOut } from "next-auth/react";
import { deleteCookie } from "cookies-next";
import { queryClient } from "@/providers/query-client-instance";

export default function handleLogout() {
  //signOut({ redirectTo: "/" });
  deleteCookie("UT");
  signOut({ redirect: true, callbackUrl: "/auth/login" })
  queryClient.clear();
}
