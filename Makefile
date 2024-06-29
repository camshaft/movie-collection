default: public/movies.tsv node_modules
	@npm run-script build

public/movies.tsv:
	@curl --fail -L "https://docs.google.com/spreadsheets/d/e/2PACX-1vQ7dvqSw51S3mvcAfXcAqbwr04bwrMBPwnrSqbkSi_dUJ1MgkwxBthmZ3D_UIh1mcxt-Ade12ovvah_/pub?gid=399752436&single=true&output=tsv" | sed 's/\r$$//' > $@.tmp
	@if ! grep -q "#NAME?" "$@.tmp"; then \
	    echo "sheets API ok"; \
	else \
	    echo "got error from sheets API; using last good deployment"; \
		curl --fail -L "https://camshaft.github.io/movie-collection/movies.tsv" | sed 's/\r$$//' > $@.tmp; \
	fi
	mv $@.tmp $@;

node_modules:
	@npm install

.PHONY: public/movies.tsv
