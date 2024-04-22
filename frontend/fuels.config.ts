import { createConfig } from 'fuels';

export default createConfig({
  contracts: [
        '../single-asset-token',
  ],
  output: './src/sway-api',
});

/**
 * Check the docs:
 * https://fuellabs.github.io/fuels-ts/tooling/cli/fuels/config-file
 */
