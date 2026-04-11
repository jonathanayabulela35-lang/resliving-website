const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

export function generateCode(prefix = "U") {
  let code = prefix;
  for (let i = 0; i < 7; i++) {
    code += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return code;
}

export function generateSecurityCode() {
  return generateCode("S");
}

export function generateUnitCode() {
  return generateCode("U");
}

export function generateUnitLabels(count, format) {
  const labels = [];

  for (let i = 0; i < count; i++) {
    const index = i + 1;

    switch (format) {
      case "numeric":
        labels.push(String(index));
        break;

      case "alphanumeric_letter_first": {
        const letter = String.fromCharCode(65 + Math.floor((index - 1) / 10));
        const num = ((index - 1) % 10) + 1;
        labels.push(`${letter}${num}`);
        break;
      }

      case "alphanumeric_number_first": {
        const floor = Math.floor((index - 1) / 10) + 1;
        const room = String.fromCharCode(65 + ((index - 1) % 10));
        labels.push(`${floor}${room}`);
        break;
      }

      default:
        labels.push(String(index));
    }
  }

  return labels;
}
