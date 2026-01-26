import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactElement,
  ReactNode,
} from "react";
import { cn } from "@/lib/cn";

type PolymorphicProps<T extends ElementType> = {
  as?: T;
  className?: string;
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "className" | "children">;

type PolymorphicComponent<TDefault extends ElementType> = <T extends ElementType = TDefault>(
  props: PolymorphicProps<T>,
) => ReactElement | null;

function createTypographyComponent<TDefault extends ElementType>(
  defaultTag: TDefault,
  baseClasses: string,
): PolymorphicComponent<TDefault> {
  const Component = <T extends ElementType = TDefault>({
    as,
    className,
    ...props
  }: PolymorphicProps<T>) => {
    const Tag = (as || defaultTag) as ElementType;

    return (
      <Tag
        className={cn(baseClasses, className)}
        {...props}
      />
    );
  };

  return Component as PolymorphicComponent<TDefault>;
}

export const Title = createTypographyComponent(
  "h1",
  "text-3xl font-semibold tracking-tight text-[var(--color-charcoal)] sm:text-4xl",
);

export const Subtitle = createTypographyComponent(
  "p",
  "text-lg font-medium text-[var(--color-slate)] sm:text-xl",
);

export const Paragraph = createTypographyComponent(
  "p",
  "text-base leading-relaxed text-[var(--color-slate)] sm:text-lg",
);

export const ParagraphWhite = createTypographyComponent(
  "p",
  "text-base leading-relaxed text-white/85 sm:text-lg",
);
