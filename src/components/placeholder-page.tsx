import type { ReactNode } from "react";

type PlaceholderPageProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function PlaceholderPage({
  title,
  description,
  children,
}: PlaceholderPageProps) {
  return (
    <div className="bg-white">
      <section className="mx-auto flex max-w-4xl flex-col gap-6 px-6 py-16 sm:px-8 sm:py-24">
        <div className="space-y-4">
          <h1 className="text-3xl font-medium tracking-tight text-[var(--color-charcoal)] sm:text-4xl">
            {title}
          </h1>
          <p className="text-lg leading-relaxed text-[var(--color-slate)]">
            {description}
          </p>
        </div>
        {children}
      </section>
    </div>
  );
}
