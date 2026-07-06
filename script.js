const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const proposal = document.getElementById("proposal");
const yesPage = document.getElementById("yesPage");
const sadPage = document.getElementById("sadPage");
const backFromYes = document.getElementById("backFromYes");
const changeMind = document.getElementById("changeMind");
const yesTitle = document.getElementById("yesTitle");

const EDGE_PADDING = 16;
const MAX_ESCAPES = 10;
const YES_TEXT_DELAY = 2500;

let escapeCount = 0;
let sizeLocked = false;
let yesTextTimer = null;

const pages = [proposal, yesPage, sadPage];

function showPage(page) {
  pages.forEach((el) => el.classList.add("hidden"));
  page.classList.remove("hidden");
}

function getSafeBounds() {
  const styles = getComputedStyle(document.documentElement);
  const safeTop = parseFloat(styles.getPropertyValue("env(safe-area-inset-top)")) || 0;
  const safeRight = parseFloat(styles.getPropertyValue("env(safe-area-inset-right)")) || 0;
  const safeBottom = parseFloat(styles.getPropertyValue("env(safe-area-inset-bottom)")) || 0;
  const safeLeft = parseFloat(styles.getPropertyValue("env(safe-area-inset-left)")) || 0;

  return {
    minX: EDGE_PADDING + safeLeft,
    minY: EDGE_PADDING + safeTop,
    maxX: window.innerWidth - EDGE_PADDING - safeRight,
    maxY: window.innerHeight - EDGE_PADDING - safeBottom,
  };
}

function lockNoButtonSize() {
  if (sizeLocked) {
    return;
  }

  const { width, height } = noBtn.getBoundingClientRect();
  noBtn.style.width = `${width}px`;
  noBtn.style.height = `${height}px`;
  sizeLocked = true;
}

function moveNoButton() {
  if (escapeCount >= MAX_ESCAPES) {
    return;
  }

  lockNoButtonSize();
  noBtn.classList.add("escaping");

  const btnRect = noBtn.getBoundingClientRect();
  const bounds = getSafeBounds();
  const maxLeft = bounds.maxX - btnRect.width;
  const maxTop = bounds.maxY - btnRect.height;

  if (maxLeft <= bounds.minX || maxTop <= bounds.minY) {
    return;
  }

  const left = bounds.minX + Math.random() * (maxLeft - bounds.minX);
  const top = bounds.minY + Math.random() * (maxTop - bounds.minY);

  noBtn.style.left = `${left}px`;
  noBtn.style.top = `${top}px`;
  escapeCount += 1;

  if (escapeCount >= MAX_ESCAPES) {
    noBtn.classList.add("caught");
  }
}

function resetNoButton() {
  escapeCount = 0;
  sizeLocked = false;
  noBtn.classList.remove("escaping", "caught");
  noBtn.style.width = "";
  noBtn.style.height = "";
  noBtn.style.left = "";
  noBtn.style.top = "";
  noBtn.style.right = "";
}

function resetYesTitle() {
  if (yesTextTimer) {
    clearTimeout(yesTextTimer);
    yesTextTimer = null;
  }

  yesTitle.textContent = "Юхууу!";
  yesTitle.classList.remove("result-title--phase2", "result-title--fade");
}

function showYesPage() {
  resetYesTitle();
  showPage(yesPage);

  yesTextTimer = setTimeout(() => {
    yesTitle.classList.add("result-title--fade");

    yesTextTimer = setTimeout(() => {
      yesTitle.textContent = "Дима..   считаю дни..))";
      yesTitle.classList.add("result-title--phase2");
      yesTitle.classList.remove("result-title--fade");
      yesTextTimer = null;
    }, 500);
  }, YES_TEXT_DELAY);
}

function returnToProposal() {
  resetNoButton();
  resetYesTitle();
  showPage(proposal);
}

noBtn.addEventListener("mouseenter", () => {
  if (escapeCount < MAX_ESCAPES) {
    moveNoButton();
  }
});

noBtn.addEventListener("touchstart", (event) => {
  if (escapeCount < MAX_ESCAPES) {
    event.preventDefault();
    moveNoButton();
  }
}, { passive: false });

noBtn.addEventListener("click", () => {
  if (escapeCount >= MAX_ESCAPES) {
    showPage(sadPage);
  }
});

yesBtn.addEventListener("click", showYesPage);
backFromYes.addEventListener("click", returnToProposal);
changeMind.addEventListener("click", returnToProposal);
