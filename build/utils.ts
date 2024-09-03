const validNuxiCommands = [
  "add",
  "analyze",
  "build",
  "build-module",
  "cleanup",
  "dev",
  "devtools",
  "generate",
  "info",
  "module",
  "prepare",
  "preview",
  "typecheck",
  "upgrade",
];

export type NuxtCommandType = {
  nuxtCommand: string | null;
  isInitPhase: boolean;
};

/**
 *
 * @returns the nuxt command that is being run, or null if it can't be determined
 */
export const getNuxtCommandInfo = (): NuxtCommandType => {
  const args = process.argv ?? [];
  const nuxiOrNuxtIndex = args.findIndex(
    (arg) =>
      /(?:\/|\\)nuxi(?:\.mjs)?$/.test(arg) || /(?:\/|\\)nuxt(?:\.mjs)?$/.test(arg),
  );
  if (args.length > nuxiOrNuxtIndex) {
    let command = (args[nuxiOrNuxtIndex + 1] ?? "").toLowerCase();
    const isInitPhase = !command.startsWith("_");
    command = command.replace(/^_+/, "");

    if (validNuxiCommands.includes(command)) {
      const ret = {
        nuxtCommand: command,
        isInitPhase: isInitPhase,
      };
      ret.toString = () =>
        `Nuxt Command: ${ret.nuxtCommand}, isInitPhase: ${ret.isInitPhase}`;
      return ret;
    }
  }
  return {
    nuxtCommand: null,
    isInitPhase: false,
  };
};
