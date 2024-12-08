const generateSuccessResponse = ({
    message,  
    data,   
  }: {
    message: string;
    data: any;
  }) => {
    return {
      status: "success",
      message: message,
      data: data,
    };
  };