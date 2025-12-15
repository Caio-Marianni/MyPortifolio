"use client";

import { ReactNode, useState, useEffect } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

interface BoardContainerProps {
  children: ReactNode;
}

export function BoardContainer({ children }: BoardContainerProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Em desktop, renderiza normalmente
  if (!isMobile) {
    return <>{children}</>;
  }

  // Em mobile, adiciona zoom/pan
  return (
    <TransformWrapper
      initialScale={0.6}
      minScale={0.4}
      maxScale={2}
      centerOnInit
      limitToBounds={false}
      panning={{
        velocityDisabled: true,
      }}
      doubleClick={{
        disabled: false,
        mode: "reset",
      }}
    >
      {({ zoomIn, zoomOut, resetTransform }) => (
        <>
          {/* Controles de zoom */}
          <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
            <button
              onClick={() => zoomIn()}
              className="p-3 rounded-full bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-lg border border-[var(--frame-color)]/20"
            >
              +
            </button>
            <button
              onClick={() => zoomOut()}
              className="p-3 rounded-full bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-lg border border-[var(--frame-color)]/20"
            >
              -
            </button>
            <button
              onClick={() => resetTransform()}
              className="p-3 rounded-full bg-[var(--bg-secondary)] text-[var(--text-primary)] shadow-lg border border-[var(--frame-color)]/20 text-xs"
            >
              R
            </button>
          </div>

          <TransformComponent
            wrapperStyle={{
              width: "100%",
              height: "100%",
            }}
            contentStyle={{
              width: "100%",
              height: "100%",
            }}
          >
            {children}
          </TransformComponent>
        </>
      )}
    </TransformWrapper>
  );
}
