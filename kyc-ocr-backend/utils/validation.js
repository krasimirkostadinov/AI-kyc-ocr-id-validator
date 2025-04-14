export function inferGender(text) {
    if (/Пол\/Sec\s*(Ж|F)/.test(text)) return "F";
    if (/Пол\/Sec\s*(М|M)/.test(text)) return "M";
    return "";
}

export function splitOcrByScript(text) {
    const latinLines = [];
    const cyrillicLines = [];

    for (const line of text.split('\n')) {
        const trimmed = line.trim();
        if (!trimmed) continue;

        const isCyrillic = /[А-Яа-яЁё]/.test(trimmed);
        (isCyrillic ? cyrillicLines : latinLines).push(trimmed);
    }

    return {
        latinBlock: latinLines.join('\n'),
        cyrillicBlock: cyrillicLines.join('\n')
    };
}