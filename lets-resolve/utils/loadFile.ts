import { RefObject } from "react";

export const loadFile = (
  target: HTMLInputElement,
  output: RefObject<HTMLImageElement>
) => {
  const reader = new FileReader();
  reader.onload = function () {
    // @ts-ignore
    output.current.src = reader.result;
    // @ts-ignore
    output.current.hidden = false;
  };

  if (target?.files && target.files.length > 0) {
    reader.readAsDataURL(target.files[0]);
  }
};
