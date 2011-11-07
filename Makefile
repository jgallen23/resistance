boosh:
	./node_modules/.bin/smoosh make build.json

test:
	./node_modules/.bin/nodeunit test/node/resistance.test.js

# requires npm >= 1.0.0
install:
	npm install smoosh

.PHONY: test
