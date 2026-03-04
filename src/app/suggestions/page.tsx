import { BackRouteButton } from '@/components/route-button'
import { Layout } from '@/modules/layout/layout'
import React from 'react'

export default function SuggestionsPage() {
    return (
        <Layout>
        <div className="min-h-dvh">
          <main className="max-w-[960px] mx-auto md:px-8">
            <div className="max-md:sticky top-0 h-[11.25rem] flex flex-col justify-end bg-black z-10 max-md:px-2 pb-2 border-b-[1.5px] border-b-subtle">
              <div className="w-fit">
                <BackRouteButton />
              </div>
            </div>
            </main>
            </div>
            </Layout>

    )
}