import toast from "react-hot-toast";

export const handleZodErrors = (error) => {
  if (error?.response?.data?.error && typeof error.response.data.error === "object") {
    const errors = error.response.data.error;
    Object.keys(errors).forEach((key) => {
      if (errors[key]._errors?.length) {
        toast.error(errors[key]._errors[0]);
      }
    });
  } else {
    toast.error(error.response?.data?.error || "Something went wrong");
  }
};