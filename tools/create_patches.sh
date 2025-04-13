#!/bin/bash

# inspired by https://github.com/VSCodium/vscodium/blob/master/docs/howto-build.md#manual

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

read -p "Do your changes inside 'assets/pdf.js', then hit any key to continue..." -n1 -s

git add .
mkdir -p $patches
git diff --cached > $patches/pdf.js.patch

rm -rf $pdfjs/.git
