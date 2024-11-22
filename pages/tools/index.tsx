import { Layout } from "@/modules/layout";
import { ToolsOnboarding } from "@/modules/tools/onboarding";
import React from "react";

export default function Tools() {
  return (
    <Layout>
      <form className="max-md:px-4">
        <ToolsOnboarding />
      </form>
    </Layout>
  );
}
