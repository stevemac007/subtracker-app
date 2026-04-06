.PHONY: install build deploy deploy-prod clean

install:
	npm install

build: install
	npm run build
	@echo "/*    /index.html   200" > dist/_redirects

deploy: build
	netlify deploy --dir=dist

deploy-prod: build
	netlify deploy --dir=dist --prod

clean:
	rm -rf dist node_modules
