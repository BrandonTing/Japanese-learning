export const CursorOptions = {
  azki: "AZKi",
  sakuramiko: "Sakura Miko"
} as const

export function getImgsVariable(member: keyof typeof CursorOptions) {
  return `
    --cursor-image-1: url("./cursor-image/${member}/pointer/${member}[normal_select]_01.png");
    --cursor-image-2: url("./cursor-image/${member}/pointer/${member}[normal_select]_02.png");
    --cursor-image-3: url("./cursor-image/${member}/pointer/${member}[normal_select]_03.png");
    --cursor-image-4: url("./cursor-image/${member}/pointer/${member}[normal_select]_04.png");
    --cursor-image-5: url("./cursor-image/${member}/pointer/${member}[normal_select]_05.png");
    --cursor-image-6: url("./cursor-image/${member}/pointer/${member}[normal_select]_06.png");

    --cursor-text-image-1: url("./cursor-image/${member}/text/${member}[text_select]_01.png");
    --cursor-text-image-2: url("./cursor-image/${member}/text/${member}[text_select]_02.png");
    --cursor-text-image-3: url("./cursor-image/${member}/text/${member}[text_select]_03.png");
    --cursor-text-image-4: url("./cursor-image/${member}/text/${member}[text_select]_04.png");
    --cursor-text-image-5: url("./cursor-image/${member}/text/${member}[text_select]_05.png");
    --cursor-text-image-6: url("./cursor-image/${member}/text/${member}[text_select]_06.png");
  `
}
