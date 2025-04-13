#!/bin/bash

set -e

repo_root=$PWD
patches=$repo_root/patches
pdfjs=$repo_root/assets/pdf.js

$PWD/tools/download_pdfjs.sh

cd $pdfjs || { echo "'assets/pdf.js' dir not found"; exit 1; }

rm -rf $pdfjs/.git # use abs path to not accidentally nuke the main .git folder
git init --quiet
git add .
git commit -m start --quiet

result=0
for p in $patches/*.patch; do
    echo $p
    if ! git apply --reject --recount --ignore-whitespace "${p}"; then
      echo failed to apply patch "${p}"
      result=1
    fi
done

rm -rf $pdfjs/.git
exit $result
