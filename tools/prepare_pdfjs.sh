#!/bin/bash

while [[ $# -gt 0 ]]; do
    case $1 in
        --update-patches)
        update_patches=true
        shift
        ;;
    *)
        echo "Unexpected argument: $1"
        exit 1
    esac
done

. tools/download_pdfjs.sh

. tools/patching.sh

prepare_patching
trap "clean_patching" EXIT

apply_patches
apply_result=$?

if [[ $apply_result -ne 0 ]]; then
    echo
    read -p "Patches did not apply cleanly, fix all conflicts (look for .rej files), then hit any key to continue..." -n1 -s
    echo

    leftover_rej=init
    while [[ $leftover_rej ]]; do
        leftover_rej=$(find assets/pdf.js -name '*.rej')
        if [[ $leftover_rej ]]; then
            echo
            echo Some .rej files remained, makes sure to remove these after resolving the conflicts:
            echo $leftover_rej

            read -p "hit any key to continue after you resolved and removed all .rej files..." -n1 -s
            echo
        fi
    done
    
    update_patches
elif [[  $update_patches ]]; then
    echo
    read -p "Do your changes inside 'assets/pdf.js', then hit any key to continue..." -n1 -s
    echo

    update_patches
fi
