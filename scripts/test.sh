#!/usr/bin/env bash
progname=$(which browserify)
echo "$progname"
if [ $progname ] && [ -x $progname ]; then
  browserify ./test/untranspiled/conjoiner.js --outfile ./test/js/conjoiner.js
  ./test/server 'test' -o
else
  echo "No music today, sorry... run npm install browserify -g then try again" >&2
  exit 1
fi
