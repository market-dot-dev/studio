const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const scrollToElement = async (id: string, delayMs: number = 100) => {
  await delay(delayMs);
  const element = document.getElementById(id);
  if (element) {
    window.scrollTo({
      top: element.offsetTop - 24,
      behavior: "smooth"
    });
  }
};
