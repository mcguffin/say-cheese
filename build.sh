#!/bin/bash

export CLOSURE_COMPILER="/usr/local/compiler-latest/compiler.jar"

combined=./js/cheese.min.js
tmp_min=./js/tmp.js

rm $combined
touch $combined

cp ./src/adapter/adapter-latest.js ./js/adapter-latest.js

# adapter latest
java -jar \
	$CLOSURE_COMPILER \
	--js ./src/adapter/adapter-latest.js \
	--js_output_file $tmp_min

cat $tmp_min >> $combined


# recorder
java -jar \
	$CLOSURE_COMPILER \
	--js ./js/jquery-webcam-recorder.js \
	--js_output_file $tmp_min

cat $tmp_min >> $combined


# pasteboard
java -jar \
	$CLOSURE_COMPILER \
	--js ./js/jquery.pasteboard.js \
	--js_output_file $tmp_min

cat $tmp_min >> $combined

# cheese
java -jar \
	$CLOSURE_COMPILER \
	--js ./js/cheese-base.js \
	--js_output_file $tmp_min

cat $tmp_min >> $combined

# cheese
java -jar \
	$CLOSURE_COMPILER \
	--js ./js/cheese.js \
	--js_output_file $tmp_min

cat $tmp_min >> $combined

# media-view
java -jar \
	$CLOSURE_COMPILER \
	--js ./js/media-view.js \
	--js_output_file $tmp_min

cat $tmp_min >> $combined

rm $tmp_min

# mxmlc ./src/WebcamRecorder.mxml