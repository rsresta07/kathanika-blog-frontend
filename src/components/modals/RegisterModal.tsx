import { Button, Modal } from "@mantine/core";
import { useState } from "react";
import CommonForm from "../common/CommonForm";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";
import { SubmitHandler } from "react-hook-form";
import { setCookie } from "cookies-next";
import { ApiRegister } from "@/api/auth";
import showNotify from "@/utils/notify";

const schema = z
  .object({
    username: z.string().min(1, "Username is required"),
    fullName: z.string().min(1, "Full name is required"),
    email: z.string().email("Email not valid"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(/[A-Za-z]/, "Password should contain at least one letter")
      .regex(/[0-9]/, "Password should contain at least one number"),
    confirmPassword: z.string(),
    contact: z.string().min(10, "Contact must be at least 10 digits"),
    location: z.string().min(1, "Location is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

interface RegisterForm {
  username: string;
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  contact: string;
  location: string;
}

const RegisterModal = ({ openLoginModal }: { openLoginModal: () => void }) => {
  const [noTransitionOpened, setNoTransitionOpened] = useState(false);
  const router = useRouter();

  const fields = [
    {
      name: "username",
      label: "Username",
      placeholder: "Enter username",
      autoComplete: "off",
    },
    {
      name: "fullName",
      label: "Full Name",
      placeholder: "Enter full name",
      autoComplete: "off",
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Your email (e.g. myemail@gmail.com)",
    },
    {
      name: "contact",
      label: "Contact",
      placeholder: "Mobile number (e.g. +977-9812345678)",
    },
    {
      name: "location",
      label: "Location",
      placeholder: "Your location (e.g. London)",
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Password",
      type: "password",
      autoComplete: "new-password",
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      placeholder: "Confirm password",
      type: "password",
      autoComplete: "new-password",
    },
  ];

  const handleSubmit: SubmitHandler<RegisterForm> = async (data) => {
    try {
      const payload = {
        ...data,
        role: "USER",
        status: "APPROVED",
      };

      const res = await ApiRegister(payload);
      console.log(res);

      if (res?.data?.id) {
        const user = {
          id: res?.data?.id,
          email: res?.data?.email,
          slug: res?.data?.slug,
          role: res?.data?.role,
        };

        setCookie("token", res?.data?.token);
        setCookie("user", JSON.stringify(user));

        setNoTransitionOpened(false);
        // openLoginModal();
        window.location.href = `/user/${user?.slug}`;
      } else {
        showNotify("fail", "Unknown error, try again later.");
      }
    } catch (error: any) {
      const code = error?.response?.data?.statusCode ?? error?.response?.status;
      const message = error?.response?.data?.message || "Something went wrong";

      if (code === 409) {
        showNotify("fail", "Account already exists — please log in.");
        openLoginModal(); // jump to login modal
      } else {
        showNotify("fail", message);
      }
    }
  };

  return (
    <>
      <Modal
        opened={noTransitionOpened}
        onClose={() => setNoTransitionOpened(false)}
        title="Sign Up Now"
        centered
        size={"lg"}
        transitionProps={{
          transition: "fade",
          duration: 600,
          timingFunction: "linear",
        }}
      >
        <CommonForm
          fields={fields}
          onSubmit={handleSubmit}
          validationSchema={zodResolver(schema)}
          buttonText="Register"
          showCheckbox={true}
          footerLinkText="Have an account?"
          footerLinkLabel="Login"
          footerLinkAction={() => {
            setNoTransitionOpened(false);
            openLoginModal();
          }}
          twoColumnLayout={true}
        />
      </Modal>

      <Button
        variant="transparent"
        color="black"
        size="compact-xl"
        onClick={() => setNoTransitionOpened(true)}
      >
        <label className="font-normal">Sign Up</label>
      </Button>
    </>
  );
};

export default RegisterModal;
