import { useState } from "react";
import { Button, Modal } from "@mantine/core";
import { signIn } from "next-auth/react";

const SocialAuthModal = () => {
  const [opened, setOpened] = useState(false);

  const handleSignIn = async (provider: string) => {
    try {
      await signIn(provider, { callbackUrl: "/" });
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error);
    }
  };

  return (
    <>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Sign In"
        centered
        transitionProps={{ transition: "fade", duration: 600 }}
      >
        <div className="flex flex-col gap-4 py-4">
          <Button
            fullWidth
            variant="default"
            onClick={() => handleSignIn("google")}
          >
            Sign in with Google
          </Button>

          <Button
            fullWidth
            color="blue"
            onClick={() => handleSignIn("facebook")}
          >
            Sign in with Meta
          </Button>
        </div>
      </Modal>

      <Button
        variant="transparent"
        color="black"
        size="compact-xl"
        onClick={() => setOpened(true)}
      >
        <span className="font-normal">Sign In</span>
      </Button>
    </>
  );
};

export default SocialAuthModal;
