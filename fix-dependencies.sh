#!/usr/bin/env bash

#
# Fix old dependencies caused bug "ReferenceError: primordials is not defined"
# 
# > You're using node 12 and gulp 3. That combination does not work: 
# > https://github.com/gulpjs/gulp/issues/2324
#

cd "$( dirname "${BASH_SOURCE[0]}" )" || exit 1;

set -x;
rm -rf node_modules/vinyl-fs/node_modules/graceful-fs || exit 1;
cp -r node_modules/graceful-fs node_modules/vinyl-fs/node_modules/graceful-fs || exit 1;

echo "Boom!";
