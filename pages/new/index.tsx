import { Layout } from "@/modules/layout";
import { NewReadingOnboarding } from "@/modules/new";
import React from "react";

export default function New() {
  return (
    <Layout>
      <form className="max-md:px-4">
        <NewReadingOnboarding />
      </form>
    </Layout>
  );
}
