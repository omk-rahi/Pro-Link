const FullPageLoader = () => {
  return (
    <div className="fixed flex h-dvh w-dvw items-center justify-center">
      <span className="h-24 w-24 animate-spin rounded-full border-8 border-blue-600 border-t-transparent"></span>
    </div>
  );
};

export default FullPageLoader;
