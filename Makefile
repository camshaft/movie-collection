default: public/movies.json node_modules
	@npm run-script build

public/movies.json: node_modules
	@./bin/load.mjs

node_modules:
	@npm install

.PHONY: public/movies.json
