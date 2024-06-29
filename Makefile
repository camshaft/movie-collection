default: public/movies.tsv node_modules
	@npm run-script build

public/movies.tsv:
	@curl --fail -L "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7dvqSw51S3mvcAfXcAqbwr04bwrMBPwnrSqbkSi_dUJ1MgkwxBthmZ3D_UIh1mcxt-Ade12ovvah_/pub?gid=399752436&single=true&output=tsv" > $@.tmp
	if ! grep -q "#NAME?" "$@.tmp"; then \
	    echo "sheets API ok"; \
		mv $@.tmp $@; \
	else \
	    echo "got error from sheets API"; \
	fi \

node_modules:
	@npm install

.PHONY: public/movies.tsv