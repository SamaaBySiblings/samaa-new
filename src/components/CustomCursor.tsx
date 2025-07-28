"use client";

import { useEffect, useRef, useState } from "react";

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const cursorRef1 = useRef<HTMLImageElement | null>(null);
  const cursorRef2 = useRef<HTMLImageElement | null>(null);

  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const currentX = useRef(0);
  const currentY = useRef(0);
  const speed = 0.9;

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;

      const target = e.target as HTMLElement;

      // Check if hovered element is a link, button, or role="button"
      const hovering =
        target.closest("a") ||
        target.closest("button") ||
        target.getAttribute("role") === "button";

      setIsHovering(!!hovering);
    };

    window.addEventListener("mousemove", handleMouseMove);

    const animate = () => {
      currentX.current += (mouseX.current - currentX.current) * speed;
      currentY.current += (mouseY.current - currentY.current) * speed;

      const x = currentX.current;
      const y = currentY.current;

      if (cursorRef1.current) {
        cursorRef1.current.style.left = `${x}px`;
        cursorRef1.current.style.top = `${y}px`;
      }

      if (cursorRef2.current) {
        cursorRef2.current.style.left = `${x}px`;
        cursorRef2.current.style.top = `${y}px`;
      }

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <>
      {/* Default shallow cursor */}
      <img
        ref={cursorRef1}
        src="https://res.cloudinary.com/db5c7s6lw/image/upload/v1753737255/1_emu3w6.png"
        className="custom-cursor default-cursor"
        alt=""
      />

      {/* Filled cursor on hover only */}
      <img
        ref={cursorRef2}
        src="https://res.cloudinary.com/db5c7s6lw/image/upload/v1753737254/2_ona2jy.png"
        className={`custom-cursor filled-cursor ${isHovering ? "show" : ""}`}
        alt=""
      />
    </>
  );
};

export default CustomCursor;
