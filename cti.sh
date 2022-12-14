#!/bin/sh

npm run cti create "./src/@seedwork/application" -- -i '*.test.ts' -b &&
npm run cti create "./src/@seedwork/domain" -- -i '*.test.ts' -b &&
npm run cti create "./src/@seedwork/infra"c -- -i '*.test.ts' -b &&


npm run cti create "./src/category/application" &&
npm run cti create "./src/category/domain" &&
npm run cti create "./src/category/" c -- -i '*.test.ts'

