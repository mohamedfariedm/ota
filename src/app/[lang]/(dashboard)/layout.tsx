import React from "react";
import DashBoardLayoutProvider from "@/providers/dashboard-layout-provider";
import { getDictionary } from "@/localization/dictionaries";
import AuthGuard from "@/providers/auth-guard";

const DashboardLayout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: any }>;
}) => {
  const { lang } = await params;

  //console.log({ lang_lang: lang });
  const trans = await getDictionary(lang);

  return (
    <AuthGuard>
      <DashBoardLayoutProvider trans={trans}>{children}</DashBoardLayoutProvider>
    </AuthGuard> 
     );
};

export default DashboardLayout;
