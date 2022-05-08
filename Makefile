install:
	npm ci
lint:
	npx eslint .
lint-fix:
	npx eslint . --fix
publish:
	npm publish --dry-run

test:
	npm test

test-coverage:
	npm test -- --coverage --coverageProvider=v8

test-watch:
	npm test -- --watchAll

link:
	npm link

setup: 
	install link
start:
	npx webpack serve