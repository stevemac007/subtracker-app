.PHONY: install build deploy deploy-prod test test-headed clean

install:
	npm install

build: install
	npm run build
	@echo "/*    /index.html   200" > dist/_redirects

deploy: build
	netlify deploy --dir=dist

deploy-prod: build
	netlify deploy --dir=dist --prod

test: build
	npx playwright test

test-headed: build
	npx playwright test --headed

clean:
	rm -rf dist node_modules
