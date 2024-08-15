export function getLSRFromHTML(html) {
  const commands = [
    "open",
    "sendkeys",
    "type",
    "click",
    "clickAt",
    "selectFrame",
  ];
  const regex = /<link\s+rel="selenium\.base"\s+href="([^"]+)"\s*\/>/;
  const match = html.match(regex);

  if (!match) return { actions: [], detection: {}, restrictions: [] };

  const baseUrl = match[1];
  const commandRegex =
    /<tr>\s*<td>(\w+)<\/td>\s*<td>([^<]*)<\/td>\s*<td>([^<]*)<\/td>\s*<\/tr>/g;
  const actions = [];
  let commandMatch;

  while ((commandMatch = commandRegex.exec(html)) !== null) {
    const [, command, target, value] = commandMatch;

    if (!commands.includes(command)) {
      console.log("Unhandled Selenium Command", command);
      continue;
    }

    switch (command) {
      case "open":
        const url = target.startsWith("http")
          ? target
          : new URL(target, baseUrl).href;
        actions.push({
          type: "navigate",
          target: url,
          timeout: 20000,
          parameters: {},
        });
        break;
      case "sendkeys":
      case "type":
        actions.push({
          type: "change",
          target,
          parameters: { value },
          timeout: 20000,
        });
        break;
      case "click":
      case "clickAt":
        actions.push({ type: "click", target, timeout: 20000 });
        break;
    }
  }

  if (actions.length > 0 && actions[0].type !== "navigate") {
    actions.unshift({
      type: "navigate",
      target: baseUrl,
      timeout: 20000,
      parameters: {},
    });
  }

  return { actions, detection: {}, restrictions: [] };
}
