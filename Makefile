npm = ./node_modules/.bin
aseprite := /Applications/Aseprite.app/Contents/MacOS/aseprite

sprites:
	$(aseprite) --batch src/assets/sprites.aseprite --scale 3 --save-as src/assets/sprites.png --data src/assets/sprites.json --list-slices

backgrounds:
	$(aseprite) --batch src/assets/city.aseprite --scale 5 --save-as src/assets/city.png
