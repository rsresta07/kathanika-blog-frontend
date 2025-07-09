import "@/styles/globals.css";
import "@mantine/core/styles.css";
import "@mantine/carousel/styles.css";
import "@mantine/notifications/styles.css";

import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { useRouter } from "next/router";
import { theme } from "@/utils/theme";

type CustomAppProps = AppProps & {
  Component: {
    getLayout?: (page: React.ReactElement) => React.ReactElement;
  };
};

export default function App({ Component, pageProps }: CustomAppProps) {
  const router = useRouter();
  const getLayout = Component.getLayout ?? ((page: React.ReactElement) => page);

  return (
    <SessionProvider session={pageProps.session}>
      <MantineProvider theme={theme} defaultColorScheme="light">
        <Notifications />
        {getLayout(<Component {...pageProps} />)}
      </MantineProvider>
    </SessionProvider>
  );
}
