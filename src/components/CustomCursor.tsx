"use client";
import { useEffect, useRef, useState } from "react";

const CustomCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [isInsideWindow, setIsInsideWindow] = useState(true);

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
    const hovering =
      target.closest("a") ||
      target.closest("button") ||
      target.getAttribute("role") === "button";

    setIsHovering(!!hovering);
    setIsInsideWindow(true);
  };

  const handleMouseLeave = () => {
    setIsInsideWindow(false);
  };

  const handleFocus = () => setIsInsideWindow(true);
  const handleBlur = () => setIsInsideWindow(false);

  document.addEventListener("mousemove", handleMouseMove);
  document.addEventListener("mouseleave", handleMouseLeave);
  window.addEventListener("blur", handleBlur);
  window.addEventListener("focus", handleFocus);

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
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseleave", handleMouseLeave);
    window.removeEventListener("blur", handleBlur);
    window.removeEventListener("focus", handleFocus);
  };
}, []);



  return (
    <>
      <img
        ref={cursorRef1}
        src="https://res.cloudinary.com/db5c7s6lw/image/upload/v1753737255/1_emu3w6.png"
        className={`custom-cursor default-cursor ${isInsideWindow ? "opacity-100" : "opacity-0"}`}
        alt=""
      />
      <img
        ref={cursorRef2}
        src="https://res.cloudinary.com/db5c7s6lw/image/upload/v1753737254/2_ona2jy.png"
        className={`custom-cursor filled-cursor ${isHovering && isInsideWindow ? "opacity-100" : "opacity-0"}`}
        alt=""
      />
    </>
  );
};

export default CustomCursor;
