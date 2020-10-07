export type CardTextToken =
  | { type: "text", value: string }
  | { type: "var", value: string }
  | { type: "num", value: string }
  | { type: "em", value: string }

export function parseCardText(src: string) {
  let tokens: CardTextToken[] = [];
  let start = 0;
  let end = 0;
  let state: CardTextToken["type"] = "text";

  function chomp() {
    if (start !== end) {
      tokens.push({ type: state, value: src.slice(start, end) });
      start = end;
    }
  }

  for (end = 0; end < src.length; end++) {
    let char = src[end];

    if (state === "text" && char === "$") {
      chomp();
      state = "var";
      start++; // skip the dollar
    }

    else if (state === "var" && (char < "a" || char > "z")) {
      chomp();
      state = "text";
    }

    else if (state === "text" && (char === "-" || (char >= "0" && char <= "9"))) {
      chomp();
      state = "num";
    }

    else if (state === "num" && (char < "0" || char > "9")) {
      chomp();
      state = "text";
    }

    else if (state === "text" && char === "*") {
      chomp();
      state = "em";
      start++; // skip the *
    }

    else if (state === "em" && char === "*") {
      chomp();
      start = end += 1;
      state = "text";
    }
  }

  chomp();

  return tokens;
}
