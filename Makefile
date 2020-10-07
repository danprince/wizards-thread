npm = ./node_modules/.bin
aseprite := /Applications/Aseprite.app/Contents/MacOS/aseprite

sprites:
	$(aseprite) --batch src/assets/sprites.aseprite --scale 3 --save-as src/assets/sprites.png --data src/assets/sprites.json --list-slices
