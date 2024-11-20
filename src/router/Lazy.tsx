import { ComponentType, createElement, lazy, Suspense } from "react";

function Lazy(
  element: () => Promise<{
    default: ComponentType<any>;
  }>,
) {
  return (
    <Suspense fallback={<div>loading...</div>}>
      {createElement(lazy(element))}
    </Suspense>
  );
}
export default Lazy;
