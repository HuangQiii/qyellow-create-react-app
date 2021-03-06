'use strict';
const fs = require('fs');
const path = require('path');
const findPkg = require('find-pkg'); // 递归查找package.json
const globby = require('globby');

const findPkgs = (rootPath, globPatterns) => {
  if (!globPatterns) {
    return [];
  }
  const globOpts = {
    cwd: rootPath,
    strict: true,
    absolute: true,
  };
  return globPatterns
    .reduce(
      (pkgs, pattern) =>
        pkgs.concat(globby.sync(path.join(pattern, 'package.json'), globOpts)),
        // globby.sync(patterns, [options])
        // Returns an Array of matching paths.
      []
    )
    .map(f => path.dirname(path.normalize(f)));
};

const findMonorepo = appDir => {
  const monoPkgPath = findPkg.sync(path.resolve(appDir, '..'));
  const monoPkg = monoPkgPath && require(monoPkgPath);
  const workspaces = monoPkg && monoPkg.workspaces;
  const patterns = (workspaces && workspaces.packages) || workspaces;
  const isYarnWs = Boolean(patterns);
  const allPkgs = patterns && findPkgs(path.dirname(monoPkgPath), patterns);
  const isIncluded = dir => allPkgs && allPkgs.indexOf(dir) !== -1;
  const isAppIncluded = isIncluded(appDir);
  const pkgs = allPkgs
    ? allPkgs.filter(f => fs.realpathSync(f) !== appDir)
    : [];

  return {
    isAppIncluded,
    isYarnWs,
    pkgs,
  };
};

module.exports = {
  findMonorepo,
};
