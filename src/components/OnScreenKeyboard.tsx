"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

export type KeyboardMode = "text" | "email" | "tel";

type KeyboardPage = "alpha" | "num" | "sym";

type OnScreenKeyboardProps = {
  mode: KeyboardMode;
  fieldKey: string;
  fieldLabel: string;
  value: string;
  shake?: boolean;
  showPreview?: boolean;
  disabled?: boolean;
  onKey: (key: string) => void;
  onBackspace: () => void;
  onClear: () => void;
  onSpace: () => void;
  onNext: () => void;
};

const ALPHA_TOP = ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"];
const ALPHA_MID = ["A", "S", "D", "F", "G", "H", "J", "K", "L"];
const ALPHA_BOT = ["Z", "X", "C", "V", "B", "N", "M"];

const NUM_TOP = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"];
const NUM_MID = ["-", "/", ":", ";", "(", ")", "₹", "&", "@", '"'];
const NUM_BOT = [".", ",", "?", "!", "'"];

const SYM_TOP = ["[", "]", "{", "}", "#", "%", "^", "*", "+", "="];
const SYM_MID = ["_", "\\", "|", "~", "<", ">", "€", "£", "¥", "•"];
const SYM_BOT = [".", ",", "?", "!", "'"];

const easeOut = [0.22, 1, 0.36, 1] as const;

function ShiftIcon({ filled }: { filled: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="osk-icon" aria-hidden>
      {filled ? (
        <path d="M12 3.2 3.4 12.2h4.2V20.2h8.8v-8h4.2L12 3.2Z" fill="currentColor" />
      ) : (
        <path
          d="M12 4.4 5.2 11.6h3.3v7.2h7v-7.2h3.3L12 4.4Zm0 2.5 3.2 3.4h-1.6v6.1h-3.2v-6.1H8.8L12 6.9Z"
          fill="currentColor"
        />
      )}
    </svg>
  );
}

function BackspaceIcon() {
  return (
    <svg viewBox="0 0 24 24" className="osk-icon" aria-hidden>
      <path
        d="M8.2 5.5h10.1A1.7 1.7 0 0 1 20 7.2v9.6a1.7 1.7 0 0 1-1.7 1.7H8.2L3.6 12l4.6-6.5Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="m10.4 9.4 4.6 4.6M15 9.4l-4.6 4.6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ReturnIcon() {
  return (
    <svg viewBox="0 0 24 24" className="osk-icon" aria-hidden>
      <path
        d="M19 7.5v4.2a2 2 0 0 1-2 2H6.8"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10.2 9.6 6.2 13.7l4 4.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function OnScreenKeyboard({
  mode,
  fieldKey,
  fieldLabel,
  value,
  shake = false,
  showPreview = true,
  disabled = false,
  onKey,
  onBackspace,
  onSpace,
  onNext,
}: OnScreenKeyboardProps) {
  const [page, setPage] = useState<KeyboardPage>(mode === "tel" ? "num" : "alpha");
  const [shift, setShift] = useState(mode === "text");

  useEffect(() => {
    setPage(mode === "tel" ? "num" : "alpha");
  }, [mode, fieldKey]);

  useEffect(() => {
    if (mode !== "text" || page !== "alpha") return;
    const shouldCapitalize = value.length === 0 || /\s$/.test(value);
    setShift(shouldCapitalize);
  }, [mode, fieldKey, value, page]);

  function pressChar(char: string) {
    if (disabled) return;
    const valueOut =
      page === "alpha" && (mode === "text" || mode === "email")
        ? shift
          ? char
          : char.toLowerCase()
        : char;
    onKey(valueOut);
    if (mode === "text" && shift && page === "alpha") {
      setShift(false);
    }
  }

  function handleSpace() {
    if (disabled) return;
    onSpace();
    if (mode === "text" && page === "alpha") {
      setShift(true);
    }
  }

  function labelFor(char: string) {
    if (page !== "alpha" || (mode !== "text" && mode !== "email")) return char;
    return shift ? char : char.toLowerCase();
  }

  function renderChars(chars: string[]) {
    return chars.map((key) => (
      <button
        key={key}
        type="button"
        className="osk-key"
        disabled={disabled}
        onClick={() => pressChar(key)}
      >
        {labelFor(key)}
      </button>
    ));
  }

  return (
    <motion.div
      className={`osk-stage${showPreview ? "" : " osk-stage--inline"}`}
      animate={shake ? { x: [0, -14, 14, -10, 10, -6, 6, 0] } : { x: 0 }}
      transition={
        shake
          ? { duration: 0.45, ease: "easeInOut" }
          : { duration: 0.28, ease: easeOut }
      }
      onMouseDown={(e) => e.preventDefault()}
    >
      {showPreview && (
        <div className={`osk-preview${shake ? " is-shake" : ""}`}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={fieldKey}
              className="osk-preview-swap"
              initial={{ opacity: 0, x: 36 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -28 }}
              transition={{ duration: 0.32, ease: easeOut }}
            >
              <span className="osk-preview-label">{fieldLabel}</span>
              <p className="osk-preview-value">
                {value || (
                  <span className="osk-preview-empty">Start typing…</span>
                )}
                <span className="osk-caret" aria-hidden />
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      <div className={`osk${shake ? " is-shake" : ""}`}>
        <div className="osk-body-slot">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`${mode}-${page}`}
              className="osk-body"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.16, ease: easeOut }}
            >
              <div className="osk-alpha">
                {page === "alpha" ? (
                  <>
                    <div className="osk-row">{renderChars(ALPHA_TOP)}</div>
                    <div className="osk-row osk-row--home">
                      {renderChars(ALPHA_MID)}
                    </div>
                    <div className="osk-row">
                      <button
                        type="button"
                        className={`osk-key osk-key-action${shift ? " is-active" : ""}`}
                        disabled={disabled}
                        aria-label="Shift"
                        aria-pressed={shift}
                        onClick={() => setShift((v) => !v)}
                      >
                        <ShiftIcon filled={shift} />
                      </button>
                      {renderChars(ALPHA_BOT)}
                      <button
                        type="button"
                        className="osk-key osk-key-action"
                        disabled={disabled}
                        aria-label="Delete"
                        onClick={onBackspace}
                      >
                        <BackspaceIcon />
                      </button>
                    </div>
                    <div className="osk-row">
                      <button
                        type="button"
                        className="osk-key osk-key-fn"
                        disabled={disabled}
                        onClick={() => setPage("num")}
                      >
                        123
                      </button>
                      <button
                        type="button"
                        className="osk-key osk-key-space"
                        disabled={disabled}
                        onClick={handleSpace}
                      >
                        space
                      </button>
                      <button
                        type="button"
                        className="osk-key osk-key-action osk-key-return"
                        disabled={disabled}
                        aria-label="Next"
                        onClick={onNext}
                      >
                        <ReturnIcon />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="osk-row">
                      {renderChars(page === "num" ? NUM_TOP : SYM_TOP)}
                    </div>
                    <div className="osk-row">
                      {renderChars(page === "num" ? NUM_MID : SYM_MID)}
                    </div>
                    <div className="osk-row">
                      <button
                        type="button"
                        className="osk-key osk-key-fn"
                        disabled={disabled}
                        onClick={() => setPage(page === "num" ? "sym" : "num")}
                      >
                        {page === "num" ? "#+=" : "123"}
                      </button>
                      {renderChars(page === "num" ? NUM_BOT : SYM_BOT)}
                      <button
                        type="button"
                        className="osk-key osk-key-action"
                        disabled={disabled}
                        aria-label="Delete"
                        onClick={onBackspace}
                      >
                        <BackspaceIcon />
                      </button>
                    </div>
                    <div className="osk-row">
                      <button
                        type="button"
                        className="osk-key osk-key-fn"
                        disabled={disabled}
                        onClick={() => setPage("alpha")}
                      >
                        ABC
                      </button>
                      <button
                        type="button"
                        className="osk-key osk-key-space"
                        disabled={disabled}
                        onClick={handleSpace}
                      >
                        space
                      </button>
                      <button
                        type="button"
                        className="osk-key osk-key-action osk-key-return"
                        disabled={disabled}
                        aria-label="Next"
                        onClick={onNext}
                      >
                        <ReturnIcon />
                      </button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
