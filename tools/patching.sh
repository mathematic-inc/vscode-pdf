#!/bin/bash

# inspired by https://github.com/VSCodium/vscodium/blob/master/docs/howto-build.md#manual

repo_root=$PWD
patches=$repo_root/patches
pdfjs=$repo_root/assets/pdf.js

function prepare_patching {
    pushd $pdfjs || { echo "'assets/pdf.js' dir not found"; exit 1; }

    rm -rf $pdfjs/.git # use abs path to not accidentally nuke the main .git folder
    git init --quiet
    git add .
    git commit -m start --quiet

    popd
}

function clean_patching {
    rm -rf $pdfjs/.git
}

function apply_patches {
    pushd $pdfjs || { echo "'assets/pdf.js' dir not found"; exit 1; }

    result=0
    for p in $patches/*.patch; do
        echo $p
        if ! git apply --reject --recount --ignore-whitespace "${p}"; then
        echo failed to apply patch "${p}"
        result=1
        fi
    done

    popd

    return $result
}

function update_patches {
    pushd $pdfjs || { echo "'assets/pdf.js' dir not found"; exit 1; }

    git add .
    mkdir -p $patches
    git diff --cached > $patches/pdf.js.patch

    popd
}

