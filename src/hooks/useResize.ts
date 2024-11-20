import { useEffect } from "react";
import _ from "lodash";

export interface Resizable {
  resize(): void;
}
const resizeInstance: Resizable[] = [];
const useResize = (immediate?: boolean) => {
  const addResizeListener = (instance: Resizable) => {
    if (immediate) {
      instance.resize();
    }
    resizeInstance.push(instance);
  };
  const removeResizeListener = (instance: Resizable) => {
    const index = resizeInstance.indexOf(instance);
    if (index !== -1) {
      resizeInstance.splice(index, 1);
    }
  };
  const triggerResize = _.debounce(() => {
    if (resizeInstance.length > 0) {
      resizeInstance.forEach((instance) => {
        instance.resize?.();
      });
    }
  }, 100);
  useEffect(() => {
    window.addEventListener("resize", triggerResize);
    return () => {
      window.removeEventListener("resize", triggerResize);
    };
  }, [triggerResize]);
  return { addResizeListener, removeResizeListener };
};
export default useResize;
