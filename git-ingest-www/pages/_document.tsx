import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preload Inter and JetBrains Mono fonts for performance */}
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
          as="style"
        />
        <link
          rel="preload"
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;600&display=swap"
          as="style"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
