export const Splash = () => {
  return (
    <div
      className={`relative min-h-[100vh] flex flex-col items-center justify-center p-8`}
    >
      <div className="flex flex-col items-center">
        <h1 className="text-8xl mb-4">Fig</h1>
        <h2 className="text-2xl max-w-[45ch] text-center mb-8">
          Build <span className="font-bold italic">open</span>,{" "}
          <span className="font-bold italic">composable</span>,{" "}
          <span className="font-bold italic">private</span>,{" "}
          <span className="font-bold italic">secure</span>,
          <span className="font-bold italic"> peer-to-peer</span> applications,
          powered by{" "}
          <a href="https://xmtp.org" target="_blank" rel="noreferrer">
            XMTP
          </a>
        </h2>
      </div>
      <nav className="absolute flex flex-row gap-8 bottom-8">
        <a href="/#features">Features</a>
        <a href="/#get-started">Get Started</a>
        <a href="/#api-reference">API Reference</a>
        <a href="/#learn-more">Learn More</a>
      </nav>
    </div>
  );
};
