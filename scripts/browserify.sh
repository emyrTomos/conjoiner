#!/usr/bin/env bash
progname=$(which browserify)
echo "$progname"
if [ $progname ] && [ -x $progname ]; then
  browserify ./classes/conjoiner.js --outfile ./test/js/conjoiner.js
else
  echo "No music today, sorry..." >&2
  exit 1
fi
