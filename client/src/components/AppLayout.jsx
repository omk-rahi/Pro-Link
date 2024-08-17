import { Outlet } from "react-router-dom";
import Header from "./Header";

const AppLayout = () => {
  return (
    <main>
      <Header />
      <main className="container mx-auto py-8">
        <Outlet />
      </main>
    </main>
  );
};

export default AppLayout;
