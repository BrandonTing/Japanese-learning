export const CursorOptions = {
  default: "Default",
  azki: "AZKi",
  sakuramiko: "Sakura Miko",
} as const

export const typeVariableNameMap = {
  default: {
    prefix: "",
    amount: 6
  },
  pointer: {
    prefix: "pointer",
    amount: 12
  },
  text: {
    prefix: "text",
    amount: 6
  },
  "not-allowed": {
    prefix: "not-allowed",
    amount: 6
  },
} as const

export function getImgsVariable(member: keyof typeof CursorOptions) {
  if (member === "default") {
    return ""
  }
  return `
    --cursor-image-1: url("/cursor-image/${member}/default/1.png");
    --cursor-image-2: url("/cursor-image/${member}/default/2.png");
    --cursor-image-3: url("/cursor-image/${member}/default/3.png");
    --cursor-image-4: url("/cursor-image/${member}/default/4.png");
    --cursor-image-5: url("/cursor-image/${member}/default/5.png");
    --cursor-image-6: url("/cursor-image/${member}/default/6.png");

    --cursor-pointer-image-1: url("/cursor-image/${member}/pointer/1.png");
    --cursor-pointer-image-2: url("/cursor-image/${member}/pointer/2.png");
    --cursor-pointer-image-3: url("/cursor-image/${member}/pointer/3.png");
    --cursor-pointer-image-4: url("/cursor-image/${member}/pointer/4.png");
    --cursor-pointer-image-5: url("/cursor-image/${member}/pointer/5.png");
    --cursor-pointer-image-6: url("/cursor-image/${member}/pointer/6.png");
    --cursor-pointer-image-7: url("/cursor-image/${member}/pointer/7.png");
    --cursor-pointer-image-8: url("/cursor-image/${member}/pointer/8.png");
    --cursor-pointer-image-9: url("/cursor-image/${member}/pointer/9.png");
    --cursor-pointer-image-10: url("/cursor-image/${member}/pointer/10.png");
    --cursor-pointer-image-11: url("/cursor-image/${member}/pointer/11.png");
    --cursor-pointer-image-12: url("/cursor-image/${member}/pointer/12.png");

    --cursor-text-image-1: url("/cursor-image/${member}/text/1.png");
    --cursor-text-image-2: url("/cursor-image/${member}/text/2.png");
    --cursor-text-image-3: url("/cursor-image/${member}/text/3.png");
    --cursor-text-image-4: url("/cursor-image/${member}/text/4.png");
    --cursor-text-image-5: url("/cursor-image/${member}/text/5.png");
    --cursor-text-image-6: url("/cursor-image/${member}/text/6.png");

    --cursor-not-allowed-image-1: url("/cursor-image/${member}/not-allowed/1.png");
    --cursor-not-allowed-image-2: url("/cursor-image/${member}/not-allowed/2.png");
    --cursor-not-allowed-image-3: url("/cursor-image/${member}/not-allowed/3.png");
    --cursor-not-allowed-image-4: url("/cursor-image/${member}/not-allowed/4.png");
    --cursor-not-allowed-image-5: url("/cursor-image/${member}/not-allowed/5.png");
    --cursor-not-allowed-image-6: url("/cursor-image/${member}/not-allowed/6.png");
  `
}
