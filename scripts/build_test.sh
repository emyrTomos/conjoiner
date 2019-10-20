#!/usr/bin/env bash
progname=$(which browserify)
echo "$progname"
if [ $progname ] && [ -x $progname ]; then
  browserify ./test/js/index.js --outfile ./test/js/conjoiner.js
else
  echo "No music today, sorry... run npm install browserify -g then try again" >&2
  exit 1
fi
