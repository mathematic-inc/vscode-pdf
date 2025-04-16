# Visual Studio Code PDF Viewer

PDF Viewer for Visual Studio Code

## Overview

This extension runs the latest `pdf.js` underneath. A demo of their editor (hence ours) can be found [here](https://mozilla.github.io/pdf.js/web/viewer.html).

## Why?

Most extensions currently in the marketplace have problems too deep to fix. These problems include memory leaks, outdated dependencies, and several debouncing issues. A priori, this extension does not have these issues and also seeks to provide only viewing capabilities. Nothing more.

## Support us

If you find this extension helpful, please consider supporting its development through GitHub Sponsors. Your support helps maintain and improve this extension. Click [here](https://github.com/sponsors/jrandolf) to become a sponsor.


## Updating PDF.js

* update `pdfjs_version.txt` to target version and hash
* from root folder of this repo run `tools/prepare_pdfjs.sh`, this will download PDF.js in given version and try to apply patches from the `patches` folder to it
    * if the patches apply cleanly the command terminates and you are done
    * if the patches fail to apply, for every conflict a `*.rej` file will be generated in the `assets/pdf.js` folder, 
        you need to resolve these manually and then delete the `.rej` files

If you want to keep current version of PDF.js but add some more patches, run with flag `--update-patches` which will stop after applying the current patches same as in the above case, leaving you to modify the `assets/pdf.js` however you see fit, 
once done new patch will be created to match your edits.

After you prepared your patches you can run the same command again, the second time the patches should apply cleanly and the `assets/pdf.js` should have the updated content you created earlier.

The `prepare_pdfjs.sh` script does not create any commits in this repo, after you are happy with the patches you prepared be sure to commit everything manually.
