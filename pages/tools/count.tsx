import { Layout } from "@/modules/layout";
import { CharacterCountTool } from "@/modules/tools";
import React from "react";

export default function CharacterCountToolPage() {
  return (
    <Layout>
      <div className="max-md:px-4">
        <CharacterCountTool />
      </div>
    </Layout>
  );
}
