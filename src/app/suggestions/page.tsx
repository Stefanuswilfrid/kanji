"use client";
import { BackRouteButton } from "@/components/route-button";
import { Textarea } from "@/components/text-area";
import { cn } from "@/lib/utils";
import { useLocale } from "@/locales/use-locale";
import { Layout } from "@/modules/layout/layout";
import React from "react";
import { toast } from "sonner";
import { api } from "@/trpc/client";

export default function SuggestionsPage() {
  const [category, setCategory] = React.useState(0);
  const { t } = useLocale();

  const mutation = api.suggestions.submit.useMutation();
  const trigger = mutation.mutateAsync;

  return (
    <Layout>
      <div className="min-h-dvh">
        <main className="max-w-[960px] mx-auto md:px-8">
          <div className="max-md:sticky top-0 h-[11.25rem] flex flex-col justify-end bg-black z-10 max-md:px-2 pb-2 border-b-[1.5px] border-b-subtle">
            <div className="w-fit">
              <BackRouteButton />
            </div>

          </div>

          <div className="mt-4">
              <div className="grid grid-cols-2 place-items-start sm:flex gap-2 max-md:px-2 md:px-3">
                <button
                  className={cn(
                    "px-3 duration-200",
                    category === 0 ? "opacity-100" : "opacity-50",
                  )}
                  onClick={() => setCategory(0)}
                >
                  {t.suggestions.buttons[0]}
                </button>
                <button
                  className={cn(
                    "px-3 duration-200",
                    category === 1 ? "opacity-100" : "opacity-50",
                  )}
                  onClick={() => setCategory(1)}
                >
                  {t.suggestions.buttons[1]}
                </button>
              </div>
            </div>

            <form
            className="max-md:px-4 md:mx-4 mt-4"
            onSubmit={async (e) => {
              try {
                e.preventDefault();
                const target = e.target as typeof e.target & { 0: { value: string } };
                const text = target[0].value;
                await trigger({ text, category });
                target[0].value = "";
                toast.success(t.suggestions.successToast, {
                  id: "suggestion-success",
                  duration: 5000,
                });
              } catch {
                toast.error(t.suggestions.errorToast, {
                  id: "suggestion-error",
                  duration: 5000,
                });
              }
            }}
          >
            {category === 0 && (
              <Textarea
                placeholder={t.suggestions.placeholders[0]}
                required
                minLength={25}
                maxLength={500}
                minHeight="136px"
              />
            )}
            {category === 1 && (
              <Textarea
                placeholder={t.suggestions.placeholders[1]}
                required
                minLength={25}
                maxLength={500}
                minHeight="136px"
              />
            )}
           

            <div className="mt-4 md:flex justify-end">
              <button
                disabled={mutation.isPending}
                className="rounded-md font-medium max-md:w-full text-black dark:text-white p-2.5 md:py-2 md:px-4 duration-200 bg-emerald-600 active:bg-emerald-700 disabled:opacity-50"
              >
                {mutation.isPending ? (
                  t.suggestions.submitLoading
                ) : (
                  <React.Fragment>{t.suggestions.submit} &#8594;</React.Fragment>
                )}
              </button>
            </div>
          </form>
        </main>
      </div>
    </Layout>
  );
}
