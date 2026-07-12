# TODO
- [ ] Set correct `tsconfig.compilerOptions.moduleResolution` for this project’s ESM output (avoid `classic`, avoid `node10`, consider `node` vs `bundler`).
- [ ] Verify runtime entry file produced by `tsc` matches `npm run start` (`dist/server.js` vs actual output).
- [ ] Update `tsconfig.json` and/or `package.json` if needed.
- [ ] Run `npm run build` and `npm run start` (or `node dist/...`) to confirm module loading works.

