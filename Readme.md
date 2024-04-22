To deploy the contract, first make sure you are inside the `single-asset-token` directory.

Then run these commands:

```forc build```

```forc deploy --testnet```


Then change your directory to frontend folder and run these commands:

```npx fuels init --contracts ../single-asset-token/ --output ./src/sway-api```

```npx fuels build```

Then add the Contract ID you got while deploying the contract in App.tsx (line number 9).

Then run `npm start` to run the development server.