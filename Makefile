boosh:
	@./node_modules/.bin/smoosh make build.json

test:
	@./node_modules/.bin/mocha -R list

.PHONY: test
