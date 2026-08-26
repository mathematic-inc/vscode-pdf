#!/bin/bash

# Read the version from the file
version_info=$(cat pdfjs_version.txt)
version=${version_info%%@*}
expected_hash=${version_info#*@}

rm -rf assets/pdf.js

# Create the target directory if it doesn't exist
mkdir -p assets/pdf.js

# Download the file
curl -L -o pdfjs.zip "https://github.com/mozilla/pdf.js/releases/download/v${version}/pdfjs-${version}-legacy-dist.zip"

# Verify the hash of the downloaded file
actual_hash=$(sha1sum pdfjs.zip | awk '{ print $1 }')

if [ "$actual_hash" != "$expected_hash" ]; then
	echo "Hash mismatch: expected $expected_hash, but got $actual_hash"
	rm pdfjs.zip
	exit 1
fi

# Unzip the file into the target directory
if ! unzip pdfjs.zip -d assets/pdf.js; then
	echo "Failed to unzip pdfjs.zip"
	exit 1
fi

# Remove the zip file after extraction
rm pdfjs.zip
