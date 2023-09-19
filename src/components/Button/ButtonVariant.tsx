type ButtonVariant = Record<string, {
        container: string
    }>;

const useButtonVariant = (variant: string) => {
    const variants: ButtonVariant = {
      primary: {
        container: "bg-indigo-500 text-white hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500",
      },
      secondary: {
        container: "bg-white/10 hover:bg-white/20 active:bg-white/30",
      },
      alert: {
        container: "bg-red-500 text-white",
      },
    };
  
    if (!variants[variant]) {
      console.error("Oopsie");
      return null;
    }
  
    return variants[variant];
  };
  
  export default useButtonVariant;