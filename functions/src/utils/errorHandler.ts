const generateErrorResponse = ({message}: { message: string }) => {
  return {
    status: "error",
    messages: [message],
  };
};


export {generateErrorResponse};
