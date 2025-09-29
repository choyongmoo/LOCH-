import { clsx, type ClassValue } from "clsx";
import React from "react";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function supportsScreenSharing(): boolean {
  return (
    typeof navigator !== "undefined" &&
    navigator.mediaDevices &&
    !!navigator.mediaDevices.getDisplayMedia
  );
}

export function mergeProps<T extends Record<string, unknown>, U extends Record<string, unknown>>(
  a: T,
  b: U
): T & U {
  const result: Record<string, unknown> = { ...a };

  for (const key of Object.keys(b)) {
    const av = (a as Record<string, unknown>)[key];
    const bv = (b as Record<string, unknown>)[key];

    if (key === "className") {
      result.className = cn(av as string | undefined, bv as string | undefined);
      continue;
    }

    const isEvent = (/^on[A-Z]/.test(key) && typeof av === "function") || typeof bv === "function";
    if (isEvent) {
      const fnA = typeof av === "function" ? (av as (...args: unknown[]) => unknown) : undefined;
      const fnB = typeof bv === "function" ? (bv as (...args: unknown[]) => unknown) : undefined;
      if (fnA && fnB) {
        result[key] = (...args: unknown[]) => {
          fnA(...args);
          return fnB(...args);
        };
      } else {
        result[key] = fnB ?? fnA;
      }
      continue;
    }

    // Default: second overrides first
    result[key] = bv;
  }

  return result as T & U;
}

export function cloneSingleChild(
  children: React.ReactNode | React.ReactNode[],
  props?: Record<string, unknown>,
  key?: unknown
) {
  return React.Children.map(children, (child) => {
    // Checking isValidElement is the safe way and avoids a typescript
    // error too.
    if (React.isValidElement(child) && React.Children.only(children)) {
      if (child.props.className) {
        // make sure we retain classnames of both passed props and child
        props ??= {};
        props.className = clsx(child.props.className, props.className);
        props.style = { ...child.props.style, ...props.style };
      }
      return React.cloneElement(child, { ...props, key });
    }
    return child;
  });
}
