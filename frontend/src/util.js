// util.js
import { toast } from "react-toastify";

export const handleError = (message) => {
  toast.error(message, {
    position: "top-right",
  });
};

export const handleSuccess = (message) => {
  toast.success(message, {
    position: "top-right",
  });
};
