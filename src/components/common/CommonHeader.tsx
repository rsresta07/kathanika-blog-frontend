import Link from "next/link";
import headerData from "@/utils/mock/headerData.json";
import CommonLogo from "@/components/common/CommonLogo";
import LoginModal from "../modals/LoginModal";
import RegisterModal from "../modals/RegisterModal";
import { useState } from "react";
import { useAuth } from "@/utils/hooks/useAuth";

export default function CommonHeader() {
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const { user, logout } = useAuth();

  const openRegisterModal = () => {
    setIsRegisterModalOpen(true);
    setIsLoginModalOpen(false);
  };

  const openLoginModal = () => {
    setIsLoginModalOpen(true);
    setIsRegisterModalOpen(false);
  };

  return (
    <main className="flex justify-between items-center container mx-auto pt-4">
      <CommonLogo />
      <section>
        <ul className="flex items-center gap-12 text-dark-font">
          {headerData?.options?.map((item: any) => (
            <li key={item.id}>
              <Link href={item?.link} className="text-xl">
                {item?.title}
              </Link>
            </li>
          ))}
          <li>
            <div className="flex items-center gap-2">
              {user ? (
                <>
                  <Link
                    href={
                      user.role === "SUPER_ADMIN"
                        ? `/dashboard/${user.slug}`
                        : `/user/${user.slug}`
                    }
                  >
                    <span className="cursor-pointer text-xl">Profile</span>
                  </Link>
                  |
                  <button onClick={logout} className="text-xl text-red-600">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <LoginModal openRegisterModal={openRegisterModal} />
                  |
                  <RegisterModal openLoginModal={openLoginModal} />
                </>
              )}
            </div>
          </li>
        </ul>
      </section>
    </main>
  );
}
