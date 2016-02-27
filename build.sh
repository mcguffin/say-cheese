#!/bin/bash

export CLOSURE_COMPILER="/usr/local/compiler-latest/compiler.jar"

cp ./src/adapter/adapter-latest.js ./js/

rm ./js/cheese.min.js

java -jar \
	$CLOSURE_COMPILER \
	--js ./js/adapter-latest.js \
	--js_output_file ./js/tmp.min.js

cat ./js/tmp.min.js >> ./js/cheese.min.js
rm ./js/tmp.min.js


java -jar \
	$CLOSURE_COMPILER \
	--js ./js/jquery-webcam-recorder.js \
	--js_output_file ./js/tmp.min.js

cat ./js/tmp.min.js >> ./js/cheese.min.js
rm ./js/tmp.min.js


java -jar \
	$CLOSURE_COMPILER \
	--js ./js/jquery.pasteboard.js \
	--js_output_file ./js/tmp.min.js

cat ./js/tmp.min.js >> ./js/cheese.min.js
rm ./js/tmp.min.js


java -jar \
	$CLOSURE_COMPILER \
	--js ./js/cheese.js \
	--js_output_file ./js/tmp.min.js

cat ./js/tmp.min.js >> ./js/cheese.min.js
rm ./js/tmp.min.js


java -jar \
	$CLOSURE_COMPILER \
	--js ./js/media-view.js \
	--js_output_file ./js/tmp.min.js

cat ./js/tmp.min.js >> ./js/cheese.min.js
rm ./js/tmp.min.js

